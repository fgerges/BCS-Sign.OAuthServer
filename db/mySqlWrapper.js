module.exports = {
    query: query
};

const mySql = require('mysql');
let connection = null;

function initConnection() {
    connection = mySql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'eth_sign'
    });
}

function query(queryString, callback) {
    initConnection();
    connection.connect();
    connection.query(queryString, function (error, results, fields) {
        console.log('mySql: query: error is: ', error, ' and results are: ', results);
        connection.end();
        callback(createDataResponseObject(error, results));
    });
}

function createDataResponseObject(error, results) {
    return {
        error: error,
        results: results === undefined ? null : results === null ? null : results
    };
}