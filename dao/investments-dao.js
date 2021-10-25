const connection = require("./connection-wrapper");
const ErrorType = require("./../errors/error-type");
let ServerError = require("../errors/server-error");

async function getAllInvestments() {

    let allInvestmentsSQL = "SELECT * from investments";
    let allInvestmentsResponse = await connection.execute(allInvestmentsSQL);

    return allInvestmentsResponse;

}

async function newInvestment(investment, userData, dateInSeconds) {

    let userID = userData.user_id;
    let investmentID = investment.investment_id;
    
    let newInvestmentSQL = "INSERT INTO user_investments (user_id, investment_id, completion_date_number) VALUES (?, ?, ?)";
    let newInvestmentResponse = await connection.executeWithParameters(newInvestmentSQL, [userID, investmentID, dateInSeconds]);

    if (newInvestmentResponse.length == 0) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    return newInvestmentResponse;

}

async function getAllUserInvestments(userData) {

    let userID = userData.user_id;

    let allUserInvestmentsSQL = "SELECT user_investments.user_investment_id, user_investments.completion_date_number, investments.investment_name, investments.required_sum, investments.required_type FROM user_investments JOIN investments ON user_investments.investment_id = investments.investment_id WHERE user_id = ?";
    let allUserInvestmentsResponse = await connection.executeWithParameters(allUserInvestmentsSQL, [userID]);

    return allUserInvestmentsResponse;

}

async function completeInvestment(userData, investment, newFunds) {

    let investment_id = investment.investment_id;
    let username = userData.username;
    let newDollar = newFunds.dollar;
    let newShekel = newFunds.shekel;
    let newEuro = newFunds.euro;
    let newYen = newFunds.yen;
    let newPound = newFunds.pound;

    let completeInvestmentSQL = "DELETE FROM user_investments WHERE user_investment_id = ?";
    let completeInvestmentResponse = await connection.executeWithParameters(completeInvestmentSQL, [investment_id]);

    if (completeInvestmentResponse.length == 0) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    let updateUserFundsSql = "UPDATE users SET dollar = ?, shekel = ?, euro = ?, yen = ?, pound = ? WHERE username = ?";
    let updateUserFundsResponse = await connection.executeWithParameters(updateUserFundsSql, [newDollar, newShekel, newEuro, newYen, newPound, username]);

    if (updateUserFundsResponse.length == 0) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    return updateUserFundsResponse;

}

module.exports = {

    getAllInvestments,
    newInvestment,
    getAllUserInvestments,
    completeInvestment

}