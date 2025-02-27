import { TSafeUser } from "@/models/user";

declare global {
  namespace Express {
    interface User extends TSafeUser {}

    interface Request {}
  }
}
