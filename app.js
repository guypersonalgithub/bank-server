const express = require("express");

const server = express();

const usersController = require("./controllers/users-controller");
const investmentsController = require("./controllers/investments-controller");

const errorHandler = require("./errors/error-handler");

const cors = require("cors");

require("dotenv").config();

const corsOptions = {
    origin: process.env.URL,
    optionsSuccessStatus: 200 
}

server.use(cors(corsOptions));

const loginFilter = require("./middleware/login-filter");

server.use(express.json());
server.use(express.urlencoded( { extended: false}));
server.use(express.json());
server.use(loginFilter());

server.use("/api/users", usersController);
server.use("/api/investments", investmentsController);
server.use(errorHandler);

server.listen(process.env.PORT || 3000, () => {

    console.log(`Listening on ${process.env.PORT}`);

})