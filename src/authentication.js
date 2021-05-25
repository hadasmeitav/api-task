const config = require('../config.json');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const users = require('./data').users;
const usersLiveData = require('./data').usersLiveData;

const register = async function ({ name, password, email, role }) {
    let user = users.find(u => u.name === name);

    if (user) {
        throw 'Failed to register : name already exists';
    }

    if (!password || !email || !role) {
        throw 'Failed to register: password and/or email and/or role can not be empty';
    }


    const userId = uuid.v4();
    user = { userId, name, password, email, role };
    users.push(user);
    usersLiveData.push({ userId, isOnline: true });

    const token = jwt.sign({ userId: user.userId, role: user.role }, config.jwt.secret, { expiresIn: '7d' });
    return {
        ...omitPassword(user),
        token
    };
};

const login = async function ({ name, password }) {
    const user = users.find(u => u.name === name && u.password === password);

    if (!user) {
        throw 'Failed to login : name or password is incorrect';
    }

    usersLiveData[usersLiveData.findIndex(usersLiveData => usersLiveData.userId === user.userId)].isOnline = true;

    const token = jwt.sign({ sub: user.userId }, config.jwt.secret, { expiresIn: '7d' });
    return {
        ...omitPassword(user),
        token
    };
}

const logout = async function ({ userId }) {
    const user = users.find(u => u.userId === userId);
    console.log('user', user)
    if (!user) {
        throw 'Failed to logout : invalid userId';
    }

    usersLiveData[usersLiveData.findIndex(user => user.userId === userId)].isOnline = false;
}

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

module.exports = { register, login, logout };