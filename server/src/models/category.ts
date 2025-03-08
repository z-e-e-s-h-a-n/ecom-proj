import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  desc: { type: String },
  image: { type: String },
  parent: { type: Schema.Types.ObjectId, ref: "Category" },
});

categorySchema.pre("save", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

export type TCategorySchema = InferMongooseSchema<typeof categorySchema>;
const CategoryModel = model("Category", categorySchema);

export default CategoryModel;
