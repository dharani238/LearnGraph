import mongoose, { Schema, Document } from "mongoose";

export interface IConcept extends Document {
  topicId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  prerequisites: mongoose.Types.ObjectId[];
  order: number;
}

const conceptSchema = new Schema<IConcept>(
  {
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    prerequisites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Concept",
      },
    ],

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IConcept>("Concept", conceptSchema);