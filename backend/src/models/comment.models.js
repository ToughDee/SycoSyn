import mongoose, {Schema} from 'mongoose'

const commentSchema = new Schema
(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    art: {
      type: Schema.Types.ObjectId,
      ref: "Art"
    },
    content: {
      type: String,
      required: true
    }
  }, { timestamps: true }
)

export const Comment = mongoose.model("Comment", commentSchema)