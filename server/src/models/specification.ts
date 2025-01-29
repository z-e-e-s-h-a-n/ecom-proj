import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ISpecification extends Document {
  name: string;
  options: string[];
  categories: ObjectId[];
  isRequired: boolean;
  isDefault: boolean;
}

const specificationSchema = new Schema<ISpecification>({
  name: { type: String, required: true, unique: true },
  options: { type: [String], required: true },
  categories: [
    { type: Schema.Types.ObjectId, ref: "Category", required: true },
  ],
  isRequired: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false },
});

const SpecificationModel = mongoose.model<ISpecification>(
  "Specification",
  specificationSchema
);
export default SpecificationModel;
