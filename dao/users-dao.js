const connection = require("./connection-wrapper");
// const dbCreation = require("./dynamic-db-creation");
const ErrorType = require("./../errors/error-type");
let ServerError = require("../errors/server-error");

async function login (user) { // Login function

    let username = user.username;
    let password = user.password;

    let loginSql = "SELECT * FROM users WHERE username =? AND password = ?";
    let loginResponse = await connection.executeWithParameters(loginSql, [username, password]);

    if (loginResponse.length == 0) {
        throw new ServerError ({httpCode: ErrorType.UNAUTHORIZED.httpCode, message: ErrorType.UNAUTHORIZED.message});
    }
    return (loginResponse[0]);

}

async function register (user) { // Signup function

    let username = user.username;
    let password = user.password;

    let signUpSql = "INSERT INTO users (username, password) VALUES (?, ?)";
    let signUpResponse = await connection.executeWithParameters(signUpSql, [username, password]);

    if (signUpResponse.length == 0) {
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});
    }

    return (signUpResponse[0]);
}

 async function exchangeCurrency(exchange, newCurrency, userData) {

    if (!newCurrency) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    userData[exchange.exchangeFromCurrency.toLowerCase()] = userData[exchange.exchangeFromCurrency.toLowerCase()] - exchange.exchangeAmount;
    userData[exchange.exchangeToCurrency.toLowerCase()] = userData[exchange.exchangeToCurrency.toLowerCase()] + newCurrency;

    let username = userData.username;
    let dollar = userData.dollar;
    let shekel = userData.shekel;
    let euro = userData.euro;
    let yen = userData.yen;
    let pound = userData.pound;

    let exchangeCurrencySQL = "UPDATE users SET dollar = ?, shekel = ?, euro = ?, yen = ?, pound = ? WHERE username = ?";
    let exchangeCurrencyResponse = await connection.executeWithParameters(exchangeCurrencySQL, [dollar, shekel, euro, yen, pound, username]);

    if (exchangeCurrencyResponse.length == 0) {

        
        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    return exchangeCurrencyResponse;

 }

module.exports = {
    login,
    register,
    exchangeCurrency
}