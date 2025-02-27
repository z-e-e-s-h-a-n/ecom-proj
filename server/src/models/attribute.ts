import { InferMongooseSchema } from "@/types/global";
import { Schema, model } from "mongoose";

const attributeSchema = new Schema({
  name: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["color", "select", "radio", "button", "image"],
    required: true,
  },
  options: { type: [String], required: true },
  categories: [
    { type: Schema.Types.ObjectId, ref: "Category", required: true },
  ],
  isRequired: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
});

export type TAttributeSchema = InferMongooseSchema<typeof attributeSchema>;
export type AttrTypes = TAttributeSchema["type"];
const AttributeModel = model("Attribute", attributeSchema);

export default AttributeModel;
