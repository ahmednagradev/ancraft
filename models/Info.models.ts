import mongoose, { Document, Schema, Types } from "mongoose";

export interface IInfo extends Document {
    fullname: string;
    bio: string;
    description: string;
    socialLinks: string[];
    projects: Types.ObjectId[];
    contact: string;
    endNote?: string;
    createdBy?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const infoSchema = new Schema<IInfo>(
    {
        fullname: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        socialLinks: {
            type: [String],
            default: [],
        },
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
        contact: {
            type: String,
            required: true,
        },
        endNote: {
            type: String,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Info = mongoose.models.Info || mongoose.model<IInfo>("Info", infoSchema);
