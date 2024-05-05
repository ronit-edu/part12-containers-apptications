const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require("./test_helper");

const api = supertest(app);
const User = require("../models/user");
const Blog = require("../models/blog");

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initial_blogs);
    await User.deleteMany({});
    await User.insertMany(helper.initial_users)
})

describe("GET /api/users", () => {
    test("returns correct amount", async () => {
    const users = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(users.body).toHaveLength(helper.initial_users.length);
    })

    test("has id property", async () => {
        const users = await api
        .get('/api/users');
        expect(users.body[0].id).toBeDefined();
    })
})

describe("POST /api/users", () => {
    test("POST creates a new user", async () => {
        const new_user = {
            username: "larki",
            name: "Larki Laananen",
            password: "DTTfp3242"
        };

        const returned_user = await api
            .post("/api/users")
            .send(new_user)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        const users_after = await api.get("/api/users");
        expect(users_after.body).toHaveLength(helper.initial_users.length + 1);
        const users = users_after.body;
        expect(users.map(u => u.id)).toContain(returned_user.body.id);
        expect(returned_user.body.username).toEqual(new_user.username);
        expect(returned_user.body.name).toEqual(new_user.name);
    })

    test("POST with password missing", async () => {
        const new_user = {
            username: "larki",
            name: "Larki Laananen",
        };
        await api
            .post("/api/users")
            .send(new_user)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        const users_after = await api.get("/api/users");
        expect(users_after.body).toHaveLength(helper.initial_users.length);
    })
    test("POST with username missing", async () => {
        const new_user = {
            name: "Larki Laananen",
            password: "larki34"
        };
        await api
            .post("/api/users")
            .send(new_user)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        const users_after = await api.get("/api/users");
        expect(users_after.body).toHaveLength(helper.initial_users.length);
    })
    test("POST with too short password", async () => {
        const new_user = {
            username: "larki",
            name: "Larki Laananen",
            password: "la"
        };
        await api
            .post("/api/users")
            .send(new_user)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        const users_after = await api.get("/api/users");
        expect(users_after.body).toHaveLength(helper.initial_users.length);
    })
    test("POST with no password", async () => {
        const new_user = {
            username: "larki",
            name: "Larki Laananen"
        };
        await api
            .post("/api/users")
            .send(new_user)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        const users_after = await api.get("/api/users");
        expect(users_after.body).toHaveLength(helper.initial_users.length);
    })
})

afterAll(async () => {
  await mongoose.connection.close();
})