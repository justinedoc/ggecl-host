import { Document, Schema, model } from "mongoose";
import { CartSchema, ICart } from "./cartModel.js";
import { Types } from "mongoose";
import { INotification, NotificationSchema } from "./NotificationSchema.js";

export interface IStudent extends Document {
  _id: Types.ObjectId;
  role: "student";
  fullName: string;
  gender: string;
  picture: string;
  username?: string;
  googleSignIn: boolean;
  emailVerified: boolean;
  isVerified: boolean;
  email: string;
  password?: string;
  notifications: INotification[];
  refreshToken?: string;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordUpdateToken?: string;
  passwordUpdateTokenExpiry?: Date;
  cartItems: ICart[];
  assignments: Types.ObjectId;
}

// Main Student Schema
export const StudentSchema = new Schema<IStudent>(
  {
    role: { type: String, default: "student" },
    fullName: { type: String, required: true },
    gender: { type: String, default: "other" },
    picture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    username: { type: String, unique: true, sparse: true },
    googleSignIn: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    passwordUpdateToken: { type: String },
    passwordUpdateTokenExpiry: { type: Date },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    notifications: { type: [NotificationSchema], default: [] },
    cartItems: { type: [CartSchema], default: [] },
    assignments: [
      {
        type: Schema.Types.ObjectId,
        ref: "assignment",
        default: [],
      },
    ],
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

StudentSchema.pre("save", async function (next) {
  if (!this.username && this.email) {
    const baseUsername = this.email.split("@")[0];
    let counter = 1;
    let uniqueUsername = baseUsername;

    while (await model("student").exists({ username: uniqueUsername })) {
      uniqueUsername = `${baseUsername}${counter++}`;
    }
    this.username = uniqueUsername;
  }

  if (!this.googleSignIn && !this.password) {
    return next(new Error("Password is required for email/password signups"));
  }

  if (this.googleSignIn) {
    this.emailVerified = true;
  }

  next();
});

export default model<IStudent>("student", StudentSchema);
