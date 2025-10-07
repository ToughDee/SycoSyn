import mongoose from "mongoose"
import {Art} from "../models/art.models.js"
import {Follow} from "../models/follow.models.js"
import {Like} from "../models/like.models.js"
import {APIError} from "../utils/APIError.js"
import {APIResponse} from "../utils/APIResponse.js"
import {AsyncHandler} from "../utils/AsyncHandler.js"

const getChannelStats = AsyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelArts = AsyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelArts
}