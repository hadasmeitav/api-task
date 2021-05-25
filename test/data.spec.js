const request = require("supertest");
const app = require("../app");

const user = {
    name: 'real-time-user',
    password: 'real-time-password',
    email: 'bob@gmail.com',
    role: 1
};

const rootUser = {
    name: 'root-user',
    password: 'root-password',
    email: 'root@gmail.com',
    role: 5
};

let token = '';
let rootToken = '';

describe('data', () => {
    beforeAll(async () => {
        const responseRoot = await request(app).post("/register").send(rootUser);
        rootToken = responseRoot.body.token;

        const response = await request(app).post("/register").send(user);
        token = response.body.token;
    });

    it("should successfully add data for an existing user", async () => {
        const response = await request(app).post("/data/add").set({ authorization: rootToken }).send({
            userId: token.userId, procedureName: 'mammogram', timestamp: 1611838874884, result: 'lorem'
        });
        expect(response.status).toEqual(200);

        const responseAddMore = await request(app).post("/data/add").set({ authorization: rootToken }).send({
            userId: token.userId, procedureName: 'ct', timestamp: 1611941299911, result: 'lorem'
        });
        expect(responseAddMore.status).toEqual(200);
    });

    it("should not be able to add data with a non root user", async () => {
        const response = await request(app).post("/data/add").set({ authorization: token }).send({
            userId: token.userId, procedureName: 'mammogram', timestamp: 1611838874884, result: 'lorem'
        });
        expect(response.status).toEqual(401);
    });

    it("should fail to add data for a non existing user", async () => {
        const response = await request(app).post("/data/add").set({ authorization: 'invalid-token' });
        expect(response.status).toEqual(401);
    });
});