import mongoose, {Schema} from 'mongoose'

const commentSchema = new Schema
(
  {
    owner: {
      type: Schema.type.ObjectId,
      ref: "User"
    },
    arts: [{
      type: Schema.type.ObjectId,
      ref: "Art"
    }],
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    }
  }, { timestamps: true }
)

export const Comment = mongoose.model("Comment", commentSchema)