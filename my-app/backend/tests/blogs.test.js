const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require("./test_helper");

const api = supertest(app);
const Blog = require("../models/blog");
const User = require('../models/user');

// Token is for perttim: Pass1

// const get_token = async () => {
//     const logged_user = await api
//         .post("/api/login")
//         .send({
//             username: "perttim",
//             password: "Pertti1234"
//         })
//     return logged_user;
// }

const get_token = async () => {
    const logged_user = await api
        .post("/api/login")
        .send({
            "username": "perttim",
            "password": "Pass1"
        });
    const token = `Bearer ${logged_user.body.token}`;
    return token;
}

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initial_blogs);
    await User.deleteMany({});
    await User.insertMany(helper.initial_users);
})

test("login", async () => {
    await api
        .post("/api/login")
        .send({
            "username": "perttim",
            "password": "Pass1"
        })
        .expect(200)
        .expect('Content-Type', /application\/json/);
})

describe("GET /api/blogs", () => {
    test("returns correct amount", async () => {
    const blogs = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(blogs.body).toHaveLength(helper.initial_blogs.length);
    })

    test("has id property", async () => {
        const blogs = await api
        .get('/api/blogs');
        expect(blogs.body[0].id).toBeDefined();
    })
})

describe("POST /api/blogs", () => {
    test("POST creates a new blog", async () => {
        const token = await get_token();
        const new_blog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
        };
        await api
            .post("/api/blogs")
            .set("Authorization", token)
            .send(new_blog)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        const blogs_after = await api.get("/api/blogs");
        expect(blogs_after.body).toHaveLength(helper.initial_blogs.length + 1);
        const blogs = blogs_after.body;
        const blog = blogs.find(b => b.title === new_blog.title);
        expect(blog.author).toEqual(new_blog.author)
        expect(blog.url).toEqual(new_blog.url)
        expect(blog.likes).toEqual(new_blog.likes)
    })

    test("POST with likes property missing", async () => {
        const token = await get_token();
        const new_blog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        };
        const returned_blog = await api
            .post("/api/blogs")
            .set("Authorization", token)
            .send(new_blog)
            .expect(201)
            .expect("Content-Type", /application\/json/);
        expect(returned_blog.body.likes).toEqual(0);
    })

    test("POST with title property missing", async () => {
        const token = await get_token();
        const new_blog = {
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 23,
        };
        await api
            .post("/api/blogs")
            .set("Authorization", token)
            .send(new_blog)
            .expect(400);
        const blogs_after = await api.get("/api/blogs");
        expect(blogs_after.body).toHaveLength(helper.initial_blogs.length);
    })

    test("POST with url property missing", async () => {
        const token = await get_token();
        const new_blog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 23,
        };
        await api
            .post("/api/blogs")
            .set("Authorization", token)
            .send(new_blog)
            .expect(400);
        const blogs_after = await api.get("/api/blogs");
        expect(blogs_after.body).toHaveLength(helper.initial_blogs.length);
    })
    test("POST with token missing", async () => {
        const new_blog = {
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 23,
        };
        await api
            .post("/api/blogs")
            .send(new_blog)
            .expect(401);
        const blogs_after = await api.get("/api/blogs");
        expect(blogs_after.body).toHaveLength(helper.initial_blogs.length);
    })
})

describe("DELETE to /api/blogs/:id", () => {
    test("Delete a blog", async () => {
        const blogs_at_start = await api.get("/api/blogs/");
        const blog_to_delete = blogs_at_start.body[0];
        await api
            .delete(`/api/blogs/${blog_to_delete.id}`)
            .expect(204)
        const blogs_at_end = await api.get("/api/blogs/");
        expect(blogs_at_end.body).toHaveLength(blogs_at_start.body.length - 1)
    })
    test ("Delete a blog with invalid id", async () => {
        const blogs_at_start = await api.get("/api/blogs/");
        await api
            .delete(`/api/blogs/213`)
            .expect(400)
        const blogs_at_end = await api.get("/api/blogs/");
        expect(blogs_at_end.body).toHaveLength(blogs_at_start.body.length)
    })
})

describe("PUT to /api/blogs/:id", () => {
    test("Update a blog", async () => {
        const blogs_at_start = await api.get("/api/blogs/");
        const blog_to_update = blogs_at_start.body[0];
        const new_title = "Hello, World!";
        await api
            .put(`/api/blogs/${blog_to_update.id}`)
            .send({...blog_to_update, title: new_title})
            .expect(201)
        const blogs_at_end = await api.get("/api/blogs/");
        expect(blogs_at_end.body).toHaveLength(blogs_at_start.body.length);
        expect(blogs_at_end.body.map(b => b.title)).toContain(new_title);
    })
    test ("Update a blog with non existing id", async () => {
        const blogs_at_start = await api.get("/api/blogs/");
        const invalid_id = await helper.non_existing_id();
        await api
            .put(`/api/blogs/${invalid_id}`)
            .send({...blogs_at_start.body[0], title: "hello there"})
            .expect(400)
        const blogs_at_end = await api.get("/api/blogs/");
        expect(blogs_at_end.body).toHaveLength(blogs_at_start.body.length)
    })
    test ("Update a blog with invalid id", async () => {
        const blogs_at_start = await api.get("/api/blogs/");
        await api
            .put("/api/blogs/21345")
            .send({...blogs_at_start.body[0], title: "hello there"})
            .expect(400)
        const blogs_at_end = await api.get("/api/blogs/");
        expect(blogs_at_end.body).toHaveLength(blogs_at_start.body.length)
    })
})

afterAll(async () => {
  await mongoose.connection.close();
})