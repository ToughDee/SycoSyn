import mongoose, {Schema} from 'mongoose'

const commentSchema = new Schema
(
  {
    owner: {
      type: Schema.type.ObjectId,
      ref: "User"
    },
    art: {
      type: Schema.type.ObjectId,
      ref: "Art"
    },
    content: {
      type: String,
      required: true
    }
  }, { timestamps: true }
)

export const Comment = mongoose.model("Comment", commentSchema)