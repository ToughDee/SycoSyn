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
      required: true
    },
    likes: {
      type: Number,
      deafult: 0
    },
    views: {
      type: Number,
      default: 0
    },
    isPublished: {
      type: Boolean,
      deafult: true
    }
  }, { timestamps: true }
)

export const Art = mongoose.model("Art", artSchema)