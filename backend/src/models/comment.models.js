import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

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

commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)