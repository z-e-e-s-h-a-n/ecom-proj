import mongoose, { Schema, Document, ObjectId } from "mongoose";

export type AttrTypes = "color" | "select" | "radio" | "button" | "image";

export interface IAttribute extends Document {
  name: string;
  type: AttrTypes;
  options: string[];
  categories: ObjectId[];
  isRequired: boolean;
  isDefault: boolean;
}

const attributeSchema = new Schema<IAttribute>({
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

const AttributeModel = mongoose.model<IAttribute>("Attribute", attributeSchema);
export default AttributeModel;
