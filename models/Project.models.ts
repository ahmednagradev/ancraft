import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  projectLogo?: string;
  projectName: string;
  projectTitle: string;
  projectImage?: string;
  projectLinks: string[];
  projectDescription: string;
  projectFeatures: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    projectLogo: {
      type: String,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectTitle: {
      type: String,
      required: true,
    },
    projectImage: {
      type: String,
    },
    projectLinks: {
      type: [String],
      default: [],
    },
    projectDescription: {
      type: String,
      required: true,
    },
    projectFeatures: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);