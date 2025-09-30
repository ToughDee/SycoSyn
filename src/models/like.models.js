import mongoose, {Schema} from 'mongoose'

const likeSchema = new Schema
(
  {
    likedBy: {
      type: Schema.type.ObjectId,
      ref: "User"
    },
    art: {
      type: Schema.type.ObjectId,
      ref: "Art"
    },
    comment: {
      type: Schema.type.ObjectId,
      ref: "Comment"
    }
  }, { timestamps: true }
)

export const Like = mongoose.model("Like", likeSchema)