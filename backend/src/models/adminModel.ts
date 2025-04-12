// src/models/adminModel.ts
import { CallbackError, Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { INotification, NotificationSchema } from "./NotificationSchema.js";

export interface IAdmin extends Document {
  email: string;
  password: string;
  fullName: string;
  picture: string;
  role: "admin";
  permissions: string[];
  notifications: INotification[];
  refreshToken?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordUpdateToken?: string;
  passwordUpdateTokenExpiry?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    picture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    permissions: {
      type: [String],
      default: [],
    },
    notifications: { type: [NotificationSchema], default: [] },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError | undefined);
  }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IAdmin>("Admin", AdminSchema);
