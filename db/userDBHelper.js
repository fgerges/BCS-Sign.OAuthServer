let mySqlConnection;

module.exports = injectedMySqlConnection => {
    mySqlConnection = injectedMySqlConnection;
    return {
        registerUserInDB: registerUser,
        getUserFromCrentials: getUserFromCrentials,
        doesUserExist: userExist
    };
};

function registerUser(email, password, registrationCallback) {
    const registerUserQuery = `INSERT INTO users (email, password) VALUES ('${email}', SHA('${password}'))`;
    mySqlConnection.query(registerUserQuery, registrationCallback);
}

function getUserFromCrentials(email, password, callback) {
    const getUserQuery = `SELECT * FROM users WHERE email = '${email}' AND password = SHA('${password}')`;
    console.log('getUserFromCrentials query is: ', getUserQuery);
    mySqlConnection.query(getUserQuery, (dataResponseObject) => {
        callback(false, dataResponseObject.results !== null && dataResponseObject.results.length === 1 ? dataResponseObject.results[0] : null);
    });
}

function userExist(email, callback) {
    const doesUserExistQuery = `SELECT * FROM users WHERE email = '${email}'`;
    const sqlCallback = (dataResponseObject) => {
        const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null;
        callback(dataResponseObject.error, doesUserExist);
    }
    mySqlConnection.query(doesUserExistQuery, sqlCallback);
}