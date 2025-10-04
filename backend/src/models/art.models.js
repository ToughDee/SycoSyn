import mongoose, {Schema} from 'mongoose'

const artSchema = new Schema
(
  {
    owner: {
      type: Schema.type.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true,
      trim: true,
      indexed: true,
    },
    content: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: ""
    },
    likes: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  }, { timestamps: true }
)

export const Art = mongoose.model("Art", artSchema)