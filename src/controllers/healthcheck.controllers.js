import {APIResponse} from '../utils/APIResponse.js'
import {AsyncHandler} from '../utils/AsyncHandler.js'

const healthCheck = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new APIResponse(200, "OK", "Healthcheck passed"))
})

export {healthCheck}
