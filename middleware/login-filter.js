const expressJWT = require("express-jwt");
const config = require("../config.json");

let { secret } = config;

function authenticateJwtRequestToken() {
    return expressJWT({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/api/users/login',
            '/api/users/signup',
        ]
    });
}

module.exports = authenticateJwtRequestToken;