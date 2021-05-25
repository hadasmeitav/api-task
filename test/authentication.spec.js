const request = require("supertest");
const app = require("../app");
const usersLiveData = require("../src/data").usersLiveData;

const user = {
    name: 'real-time-user',
    password: 'real-time-password',
    email: 'bob@gmail.com',
    role: 1
};

let token = '';

describe('authentication', () => {
    it("should do a successful registeration for a new user", async () => {
        const response = await request(app).post("/register").send(user);
        token = response.body.token;

        expect(response.status).toEqual(200);
    });

    it("should fail to register an existing user", async () => {
        const response = await request(app).post("/register").send(user);
        expect(response.status).toEqual(500);
        expect(response.text).toContain('name already exists');
    });

    it("should do a successful login with an existing user", async () => {
        const response = await request(app).post("/login").send({ name: user.name, password: user.password });
        expect(response.status).toEqual(200);
    });

    it("should fail to login on invalid password", async () => {
        const response = await request(app).post("/login").send({ name: user.name, password: 'non-valid' });
        expect(response.status).toEqual(500);
    });

    it("should fail to login with a non existing user", async () => {
        const response = await request(app).post("/login").send({ name: 'test', password: 'test' });
        expect(response.status).toEqual(500);
    });

    it("should do a successful logout with an existing user", async () => {
        console.log('token', token);
        await request(app).post("/logout").set({ authorization: token });
        expect(usersLiveData[0].isOnline).toBeFalsy();
    });

    it("should fail to logout with a non existing user", async () => {
        const response = await request(app).post("/logout").set({ authorization: 'not-valid' });
        expect(response.status).toEqual(401);
    });
});