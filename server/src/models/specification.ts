import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const specificationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  options: { type: [String], required: true },
  categories: [
    { type: Schema.Types.ObjectId, ref: "Category", required: true },
  ],
  isRequired: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
});

export type TSpecificationSchema = InferMongooseSchema<
  typeof specificationSchema
>;
const SpecificationModel = model("Specification", specificationSchema);

export default SpecificationModel;
