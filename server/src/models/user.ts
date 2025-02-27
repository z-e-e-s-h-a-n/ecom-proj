import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { InferMongooseSchema } from "@/types/global";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    isAuth: { type: Boolean, default: false },
    googleId: { type: String },
    facebookId: { type: String },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  {
    methods: {
      comparePassword: async function (password: string) {
        if (!this.password) throw new Error("Password is not set");
        return bcrypt.compare(password, this.password);
      },
    },
  }
);

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

export type TUserSchema = InferMongooseSchema<typeof userSchema>;
export type TProviderKeys = "googleId" | "facebookId";
export type UserRole = TUserSchema["role"];
export type TSafeUser = Omit<TUserSchema, "password" | TProviderKeys>;

const UserModel = model("User", userSchema);

export default UserModel;
