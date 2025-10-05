import { OtpPurpose } from "@prisma/client";

declare global {
  export type NotificationPurpose = "signup" | "orderConfirmation" | OtpPurpose;
}
