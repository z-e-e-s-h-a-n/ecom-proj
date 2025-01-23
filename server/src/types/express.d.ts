import { IPasswordResetToken } from "@/models/PasswordResetToken";
import { ISafeUser } from "@/models/user";

declare global {
  namespace Express {
    interface User extends ISafeUser {}
    interface passwordResetToken extends IPasswordResetToken {}
  }
}
