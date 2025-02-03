import { ISafeUser } from "@/models/user";

declare global {
  namespace Express {
    interface User extends ISafeUser {}

    interface Request {}
  }
}
