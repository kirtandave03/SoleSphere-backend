class apiResponse {
    /*
    data:{},
    error:{},
    message:""
    */
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode
    }
}

module.exports = apiResponse