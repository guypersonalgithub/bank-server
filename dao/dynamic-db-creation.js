const connection = require("./connection-wrapper");

// This file essentially allows to create the entire required database from scratch assuming it doesn't already exist.

async function createUsersTable () {
    let sql = "CREATE TABLE IF NOT EXISTS users (user_id BIGINT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(45) UNIQUE, password VARCHAR(45), dollar BIGINT DEFAULT 5000, shekel BIGINT DEFAULT 0, euro BIGINT DEFAULT 0, yen BIGINT DEFAULT 0, pound BIGINT DEFAULT 0)";
    await connection.execute(sql);
}

async function createInvestmentsTable () {
    let sql = "CREATE TABLE IF NOT EXISTS investments (investment_id BIGINT AUTO_INCREMENT PRIMARY KEY, investment_name VARCHAR(45) UNIQUE, required_sum BIGINT, required_type VARCHAR(45), investment_duration BIGINT, potential_growth_percentage BIGINT)";
    await connection.execute(sql);
}

async function userInvestmentsTable() {
    let sql = "CREATE TABLE IF NOT EXISTS user_investments (user_investment_id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT, FOREIGN KEY (user_id) REFERENCES users (user_id), investment_id BIGINT, FOREIGN KEY (investment_id) REFERENCES investments (investment_id), completion_date_number BIGINT)";
    await connection.execute(sql);
}

createUsersTable();
createInvestmentsTable();
userInvestmentsTable();