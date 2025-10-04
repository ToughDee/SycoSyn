import mongoose, {Schema} from 'mongoose'

const likeSchema = new Schema
(
  {
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    art: {
      type: Schema.Types.ObjectId,
      ref: "Art"
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }
  }, { timestamps: true }
)

export const Like = mongoose.model("Like", likeSchema)