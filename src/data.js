var users = [];
var usersLiveData = [];
var data = new Map();

const addData = async function ({ userId, procedureName, timestamp, result }) {
    if (data.get(userId)) {
        data.set(userId, [...data.get(userId), { procedureName, timestamp, result }]);
    } else {
        data.set(userId, [{ procedureName, timestamp, result }]);
    }
}

module.exports = { users, usersLiveData, data, addData };