const dao = require("../dao/investments-dao");
const ErrorType = require("./../errors/error-type");
const cache = require("../cache/usersCache");
let ServerError = require("../errors/server-error");
let allInvestments = [];

async function saveAllInvestmentsInTempCache() {

    allInvestments = await dao.getAllInvestments();

}

saveAllInvestmentsInTempCache();

async function getAllInvestments(token) {

    let activeInvestments = await getAllUserInvestments(token);

    let investments = [allInvestments, activeInvestments];

    return investments;

}

async function newInvestment(token, investment) {

    let userData = await cache.getData(token);

    if (!userData) {

        throw new ServerError({httpCode: ErrorType.TOKEN_NOT_FOUND.httpCode, message: ErrorType.TOKEN_NOT_FOUND.message});

    }

    if (userData[investment.required_type] < investment.required_sum) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    let investmentDuration = investment.investment_duration;

    let dateInSeconds = new Date();
    dateInSeconds.setTime(dateInSeconds.getTime() + (60000 * investmentDuration));

    dateInSeconds = Math.floor(dateInSeconds/1000);

    const newInvestment = await dao.newInvestment(investment, userData, dateInSeconds);

    let activeInvestment = {

        investment_id: newInvestment.insertId,
        investment_name: investment.investment_name,
        amount_gained: investment.required_sum,
        currency_type: investment.required_type,
        time_remaining: dateInSeconds

    }

    userData[investment.required_type] = userData[investment.required_type] - investment.required_sum;

    userData.investments.push(activeInvestment);

    return activeInvestment;

}

async function getAllUserInvestments(token) {

    let userData = await cache.getData(token);

    if (!userData) {

        throw new ServerError({httpCode: ErrorType.TOKEN_NOT_FOUND.httpCode, message: ErrorType.TOKEN_NOT_FOUND.message});

    }

    if (!userData.investments) {

        const userInvestments = await dao.getAllUserInvestments(userData);

        let investments = [];
    
        for (let i = 0; i < userInvestments.length; i++) {
    
            let activeInvestment = {
    
                investment_id: userInvestments[i].user_investment_id,
                investment_name: userInvestments[i].investment_name,
                amount_gained: userInvestments[i].required_sum,
                currency_type: userInvestments[i].required_type,
                time_remaining: userInvestments[i].completion_date_number
    
            }
    
            investments.push(activeInvestment);
    
        }

        userData.investments = investments;
    
        return investments;

    }

    else {

        return userData.investments;

    }

}

async function completeInvestment(token, finishedInvestment) {

    let userData = await cache.getData(token);

    if (!userData) {

        throw new ServerError({httpCode: ErrorType.TOKEN_NOT_FOUND.httpCode, message: ErrorType.TOKEN_NOT_FOUND.message});

    }

    let finishedInvestmentTime = userData.investments[finishedInvestment.index];

    let current_date = Math.floor(new Date().getTime() / 1000);

    if (current_date < finishedInvestmentTime) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    let potential_growth;
    let currency_type;

    for (let i = 0; i < allInvestments.length; i++) {

        if (userData.investments[finishedInvestment.index].investment_name == allInvestments[i].investment_name) {

            potential_growth = allInvestments[i].required_sum * (allInvestments[i].potential_growth_percentage + 100) / 100;
            currency_type = allInvestments[i].required_type;

        }

    }

    if (!potential_growth || !currency_type) {

        throw new ServerError({httpCode: ErrorType.INCORRECT_INPUT.httpCode, message: ErrorType.INCORRECT_INPUT.message});

    }

    let newFunds = {

        dollar: userData.dollar,
        shekel: userData.shekel,
        euro: userData.euro,
        yen: userData.yen,
        pound: userData.pound

    }

    newFunds[currency_type] = newFunds[currency_type] + potential_growth;

    const completeInvestment = await dao.completeInvestment(userData, finishedInvestment, newFunds);

    userData.investments.splice(finishedInvestment.index, 1);
    userData.dollar = newFunds.dollar;
    userData.shekel = newFunds.shekel;
    userData.euro = newFunds.euro;
    userData.yen = newFunds.yen;
    userData.pound = newFunds.pound;

    console.log(userData);

    return completeInvestment;

}

module.exports = {

    getAllInvestments,
    newInvestment,
    getAllUserInvestments,
    completeInvestment

}