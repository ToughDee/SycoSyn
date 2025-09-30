import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema
(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      indexed: true,
    },
    fullname: {
      type: String,
      trim: true,
      indexed: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,

    },
    history: [{
      type: Schema.Types.ObjectId,
      ref: "Art"
    }]
  }, { timestamps: true }
)

export const User = mongoose.model("User", userSchema)