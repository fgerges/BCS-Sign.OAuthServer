let userDBHelper;

module.exports = injectedUserDBHelper => {
    userDBHelper = injectedUserDBHelper;
    return {
        registerUser: registerUser,
        login: login
    };
};

function registerUser(req, res) {
    console.log(`authRoutesMethods: registerUser: req.body is:`, req.body);

    userDBHelper.doesUserExist(req.body.email, (sqlError, doesUserExist) => {
        if (sqlError !== null || doesUserExist) {
            const message = sqlError !== null ? "Operation unsuccessful" : "User already exists";
            const error = sqlError !== null ? sqlError : "User already exists";
            sendResponse(res, message, sqlError);
            return;
        }

        userDBHelper.registerUserInDB(req.body.email, req.body.password, dataResponseObject => {
            const message = dataResponseObject.error === null ? "Registration was successful" : "Failed to register user";
            sendResponse(res, message, dataResponseObject.error);
        });
    });
}

function login(registerUserQuery, res) {
    console.log('login: ');
    console.log(registerUserQuery);
}

//sends a response created out of the specified parameters to the client.
//The typeOfCall is the purpose of the client's api call
function sendResponse(res, message, error) {
    res
        .status(error !== null ? error !== null ? 400 : 200 : 400)
        .json({
            'message': message,
            'error': error
        });
}