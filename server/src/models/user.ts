import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface ISafeUser {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isAuth: boolean;
}

export type TProviderKeys = "googleId" | "facebookId";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role: UserRole;
  password?: string;
  isAuth: boolean;
  googleId?: string;
  facebookId?: string;
  comparePassword(password: string): Promise<boolean>;
}

export type UserRole = "customer" | "admin";

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String },
  isAuth: { type: Boolean, default: false },
  googleId: { type: String },
  facebookId: { type: String },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    return next(new Error("User must have either an email or phone number"));
  }
  next();
});

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if (this.email && this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }

  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
