const express = require("express");
const investmentsLogic = require("../logic/investments-logic");
const ErrorType = require("./../errors/error-type");
const router = express.Router();

router.get("/getinvestments", async (request, response) => {

    try {
        let autorizationString = request.headers["authorization"];
        let token = autorizationString.substring("Bearer ".length);
        const allInvestments = await investmentsLogic.getAllInvestments(token);
        response.send(allInvestments);

    }
    catch(error) {

        response.status(error.errorType.httpCode).send(error.errorType.message);

    }

});

router.post("/newinvestment", async (request, response) => {

    try{
        let autorizationString = request.headers["authorization"];
        let token = autorizationString.substring("Bearer ".length);
        let investment = request.body;

        const newInvestment = await investmentsLogic.newInvestment(token, investment);
        response.send(newInvestment);

    }
    catch(error) {

        response.status(error.errorType.httpCode).send(error.errorType.message);

    }

});

router.patch("/completeinvestment", async (request, response) => {

    try {
        let autorizationString = request.headers["authorization"];
        let token = autorizationString.substring("Bearer ".length);
        let investment = request.body;

        const completeInvestment = await investmentsLogic.completeInvestment(token, investment);
        response.send({investment_status: "completed"});

    }
    catch(error) {

        response.status(error.errorType.httpCode).send(error.errorType.message);

    }

});

module.exports = router;