let ErrorType = {

    GENERAL_ERROR : { id: 1, httpCode: 500, message : "Something went wrong", isShowStackTrace: true},
    TOKEN_NOT_FOUND : { id: 2, httpCode: 401, message : "The user is unauthorized as their data is no longer in the user cache and thus are required to login once again.", isShowStackTrace: false},
    INCORRECT_INPUT : { id: 3, httpCode: 602, message : "Some of the details you have written are incorrect and do not fit our requirements. Please try again with different details.", isShowStackTrace: false},
    UNAUTHORIZED : { id: 4, httpCode: 401, message : "Login failed, invalid username or password", isShowStackTrace: false},

}

module.exports = ErrorType;