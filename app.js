const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const authenticationService = require('./src/authentication');
const dataService = require('./src/data');
const jwt = require('./src/jwt');

const register = async (req, res, next) => {
    await authenticationService.register(req.body)
        .then(user => res.json(user))
        .catch(next);
}

const login = async (req, res, next) => {
    await authenticationService.login(req.body)
        .then(user => res.json(user))
        .catch(next);
}

const logout = async (req, res, next) => {
    const result = jwt.authenticate(req, res, next);

    if (result) {
        await authenticationService.logout({ userId: result.userId });
    }
}

const addData = async (req, res, next) => {
    const result = jwt.authenticate(req, res, next);
    if (result) {
        const { userId, role } = result;
        if (role !== 5) {
            res.sendStatus(401);
        } else {
            await dataService.addData({ userId, ...req.body });
            res.sendStatus(200);
            res.end();
        }
    }
}

app.use(bodyParser.json());

app.post('/register', register);
app.post('/login', login);
app.post('/logout', logout);
app.post('/data/add', addData);

module.exports = app;