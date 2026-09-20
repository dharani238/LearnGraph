import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  name: string;
  description: string;
  icon?: string;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: "📚",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubject>("Subject", subjectSchema);