import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request, Response } from "express";
import argon2 from "argon2";
import { PrismaService } from "@/modules/prisma/prisma.service";
import {
  RequestOtpDto,
  ResetPasswordDto,
  SignInDto,
  SignUpDto,
  ValidateOtpDto,
} from "@/common/dto/auth.dto";
import { TokenService } from "@/modules/token/token.service";
import { OtpPurpose, Prisma } from "@prisma/client";
import { OtpService } from "./otp.service";

type IdentifierKey = "email" | "phone";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService
  ) {}

  async signUp(dto: SignUpDto) {
    const { key, value, query } = this.parseIdentifier(dto.identifier);

    const existingUser = await this.prisma.user.findUnique({
      where: query,
    });

    if (existingUser) {
      throw new BadRequestException(`${key} already in use.`);
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        [key]: value,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        roles: { create: [{ role: "customer" }] },
      },
    });

    await this.sendOtpHelper(
      newUser.id,
      key,
      value,
      key === "email" ? "verifyEmail" : "verifyPhone"
    );

    return {
      message: `User created successfully. Please verify your ${key}.`,
    };
  }

  async signIn(dto: SignInDto, req: Request, res: Response) {
    const { key, query } = this.parseIdentifier(dto.identifier);

    const user = await this.prisma.user.findUnique({
      where: query,
      include: { roles: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await this.verifyPassword(
      dto.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    this.checkVerificationStatus(user, key, "unverified");

    const roles = user.roles.map((r) => r.role);

    await this.tokenService.createAuthSession(req, res, {
      id: user.id,
      roles: roles,
    });

    return {
      message: "Signed in successfully",
      data: { id: user.id, roles: roles },
    };
  }

  async signOut(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    const tokenId = req.cookies.tokenId;

    if (refreshToken && tokenId) {
      await this.prisma.refreshToken.update({
        where: { token: refreshToken, id: tokenId },
        data: { blacklisted: true },
      });
    }

    this.tokenService.clearAuthCookies(res);
    return { message: "Signed out successfully" };
  }

  async requestOtp(dto: RequestOtpDto) {
    const { user, key, value } = await this.findUserByIdentifier(
      dto.identifier
    );

    if (dto.purpose.includes("verify")) {
      this.checkVerificationStatus(user, key, "verified");
      await this.sendOtpHelper(user.id, key, value, dto.purpose);
      return { message: `Verification OTP sent.` };
    }

    if (dto.purpose.includes("password")) {
      if (dto.purpose === "setPassword" && user.password) {
        throw new BadRequestException(
          "Password already set. Use resetPassword."
        );
      } else if (dto.purpose === "resetPassword" && !user.password) {
        throw new BadRequestException("No password set. Use setPassword.");
      }

      await this.sendOtpHelper(user.id, key, value, dto.purpose);
      return { message: "Password reset OTP sent." };
    }

    throw new BadRequestException(`Invalid purpose: ${dto.purpose}`);
  }

  async validateOtp(dto: ValidateOtpDto) {
    const { key, user } = await this.findUserByIdentifier(dto.identifier);

    const otp = await this.otpService.verifyOtp({
      userId: user.id,
      purpose: dto.purpose,
      secret: dto.secret,
      type: dto.type,
      verifyOnly: dto.verifyOnly,
    });

    if (dto.verifyOnly) {
      return {
        message: "Otp Successfully Verified",
        data: { secret: otp.secret },
      };
    }

    if (dto.purpose.includes("verify")) {
      await this.prisma.user.update({
        where: { id: user.id },
        data:
          key === "email"
            ? { isEmailVerified: true }
            : { isPhoneVerified: true },
      });
      return { message: `${key} verified successfully.` };
    }

    if (dto.purpose.includes("password")) {
      return { message: "OTP validated successfully." };
    }

    throw new BadRequestException(`Invalid purpose: ${dto.purpose}`);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { user } = await this.findUserByIdentifier(dto.identifier);

    const hashedPassword = await this.hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { message: "Password reset successfully" };
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  private async verifyPassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    return argon2.verify(hash, password);
  }

  private async findUserByIdentifier(identifier: string) {
    const { key, value, query } = this.parseIdentifier(identifier);
    const user = await this.prisma.user.findUnique({ where: query });
    if (!user) throw new BadRequestException("User not found");
    return { user, key, value };
  }

  private checkVerificationStatus(
    user: any,
    key: IdentifierKey,
    check: "verified" | "unverified"
  ) {
    const isVerified =
      key === "email" ? user.isEmailVerified : user.isPhoneVerified;

    if (check === "verified" && isVerified) {
      throw new BadRequestException(`${key} is already verified.`);
    }

    if (check === "unverified" && !isVerified) {
      throw new UnauthorizedException(`${key} not verified`);
    }
  }

  private parseIdentifier(identifier: string): {
    key: IdentifierKey;
    value: string;
    query: Prisma.UserWhereUniqueInput;
  } {
    const isEmail = identifier.includes("@");
    const key = isEmail ? "email" : "phone";
    const value = isEmail ? identifier.toLowerCase() : identifier;
    const query = key === "email" ? { email: value } : { phone: value };

    return { key, value, query };
  }

  private async sendOtpHelper(
    userId: string,
    key: IdentifierKey,
    value: string,
    purpose: OtpPurpose
  ) {
    await this.otpService.sendOtp({ userId, [key]: value, purpose });
  }
}
