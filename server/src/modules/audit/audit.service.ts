import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { AuditAction, AuditSeverity } from "@prisma/client";

interface AuditLogMetadata {
  [key: string]: any;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    userId: string,
    action: AuditAction,
    severity: AuditSeverity,
    metadata?: AuditLogMetadata
  ) {
    return this.prisma.auditLog.create({
      data: { userId, action, severity, metadata },
    });
  }
}
