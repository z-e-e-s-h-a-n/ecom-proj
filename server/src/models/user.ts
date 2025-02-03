import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  googleId?: string;
  facebookId?: string;
  role: UserRole;
  comparePassword(password: string): Promise<boolean>;
}

export type UserRole = "customer" | "admin";

export interface ISafeUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  googleId?: string;
  facebookId?: string;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String },
  facebookId: { type: String },
  role: { type: String, enum: ["customer", "admin"], default: "customer" },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase();
  }
  next();
});

userSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
