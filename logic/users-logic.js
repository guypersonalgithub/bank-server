const dao = require("../dao/users-dao");
const ErrorType = require("./../errors/error-type");
const cache = require("../cache/usersCache");
const config = require("../config.json")
const jwt = require("jsonwebtoken");
let ServerError = require("../errors/server-error");

const currency = {

    Dollar: {

        Shekel: 3.26,
        Euro: 0.82,
        Yen: 108.93,
        Pound: 0.71
    
    },

    Shekel: {

        Dollar: 0.31,
        Euro: 0.25,
        Yen: 33.47,
        Pound: 0.22
    
    },

    Euro: {

        Dollar: 1.22,
        Shekel: 3.97,
        Yen: 132.73,
        Pound: 0.86
    
    },

    Yen: {

        Dollar: 0.0092,
        Shekel: 0.030,
        Euro: 0.0075,
        Pound: 0.0065
    
    },

    Pound: {

    Dollar: 1.42,
    Shekel: 4.61,
    Euro: 1.16,
    Yen: 154.21

    }

}

async function login(user) { // login

    let username = user.username;
    let password = user.password;

    if (username.length < 4 || username.length > 12) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }


    if (password.length < 4 || password.length > 12) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    let loginUser = await dao.login(user);

    // post login

    let userData = {

        user_id: loginUser.user_id,
        username: loginUser.username,
        dollar: loginUser.dollar,
        shekel: loginUser.shekel,
        euro: loginUser.euro,
        yen: loginUser.yen,
        pound: loginUser.pound

    }

    const token = jwt.sign( { sub: loginUser.username}, config.secret);

    cache.setData(token, userData);

    let response = {
        token: token, 
        username: loginUser.username, 
        dollar: loginUser.dollar, 
        shekel: loginUser.shekel,
        euro: loginUser.euro,
        yen: loginUser.yen,
        pound: loginUser.pound
    };

    return response;
}

async function register(user) { // register

    let username = user.username;
    let password = user.password;

    if (username.length < 4 || username.length > 12) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }


    if (password.length < 4 || password.length > 12) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }


    let registerUser = await dao.register(user);
    return registerUser;
}

async function checkIfUserIsOnline(token) {

    let userDetails;

    if ((await cache.getCache()).has(token)) {

        userDetails = await cache.getData(token);

    }
    else {

        throw new ServerError({httpCode: ErrorType.TOKEN_NOT_FOUND.httpCode, message: ErrorType.TOKEN_NOT_FOUND.message});

    }

    return userDetails;

}

async function exchangeCurrency(token, exchange) {

    console.log(exchange);

    let userData = await cache.getData(token);

    if (!userData) {

        throw new ServerError({httpCode: ErrorType.TOKEN_NOT_FOUND.httpCode, message: ErrorType.TOKEN_NOT_FOUND.message});

    }

    let regex = /^[0-9]+$/;

    if (!exchange.exchangeAmount.match(regex)) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    // let userData = await cache.getData(token);

    if (exchange.exchangeFromCurrency == "Dollar" && userData.dollar < exchange.exchangeAmount) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    else if (exchange.exchangeFromCurrency == "Shekel" && userData.shekel < exchange.exchangeAmount) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    else if (exchange.exchangeFromCurrency == "Euro" && userData.euro < exchange.exchangeAmount) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    else if (exchange.exchangeFromCurrency == "Yen" && userData.yen < exchange.exchangeAmount) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    else if (exchange.exchangeFromCurrency == "Pound" && userData.pound < exchange.exchangeAmount) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    let newCurrency;

    if (userData.hasOwnProperty(exchange.exchangeFromCurrency.toLowerCase())) {

        newCurrency = exchange.exchangeAmount * currency[exchange.exchangeFromCurrency][exchange.exchangeToCurrency];

    }

    const exchangeCurrency = await dao.exchangeCurrency(exchange ,newCurrency, userData);        

    return exchangeCurrency;

}

module.exports = {
    login,
    register,
    checkIfUserIsOnline,
    exchangeCurrency
}