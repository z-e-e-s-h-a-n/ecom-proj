import { OrderStatus, OtpPurpose } from "@prisma/client";

declare global {
  type NotificationPurpose = "signin" | "signup" | `orderStatus` | OtpPurpose;
}
