import { IPasswordResetToken } from "@/models/PasswordResetToken";
import { IUser } from "@/models/user";

declare global {
  namespace Express {
    interface User extends IUser {}
    interface passwordResetToken extends IPasswordResetToken {}
  }
}
