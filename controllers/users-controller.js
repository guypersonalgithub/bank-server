const express = require("express");
const usersLogic = require("../logic/users-logic");
const ErrorType = require("./../errors/error-type");
const router = express.Router();

router.post("/login", async (request, response) => {

    try {

        let user = request.body;

        const loginUser = await usersLogic.login(user);

        response.send(loginUser);
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.post("/signup", async (request, response) => {

    try {
        let user = request.body;

        const registerUser = await usersLogic.register(user);
        response.status(201).json({"signup_approval" : "Registered successfully!"});
    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }
});

router.patch("/exchangecurrency", async (request, response) => {

    try {
        let autorizationString = request.headers["authorization"];
        let token = autorizationString.substring("Bearer ".length);
        let exchange = request.body;
        const exchangeCurrency = await usersLogic.exchangeCurrency(token, exchange);
        response.status(200).json({confirmation: "action confirmed!"});

    }
    catch (error) {
        response.status(error.errorType.httpCode).send(error.errorType.message);
    }


});

router.get("/checkifuserisonline", async (request, response) => {
    
    try {

        let autorizationString = request.headers["authorization"];
        let token = autorizationString.substring("Bearer ".length);
        const userDetails = await usersLogic.checkIfUserIsOnline(token);
        response.status(200).json(userDetails);

    }
    catch (error) {

        response.status(error.errorType.httpCode).send(error.errorType.message);

    }

});

module.exports = router;