import mongoose, {Schema} from 'mongoose'

const boardSchema = new Schema
(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    arts: [{
      type: Schema.Types.ObjectId,
      ref: "Art"
    }],
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    }
  }, { timestamps: true }
)

export const Board = mongoose.model("Board", boardSchema)