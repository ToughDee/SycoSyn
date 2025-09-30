class APIResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode,
    this.message = message,
    this.success = true,
    this.data = data
  }
}

export {APIResponse}