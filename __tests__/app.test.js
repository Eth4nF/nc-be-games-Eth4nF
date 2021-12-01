const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require("supertest");
const app = require("../app");
const { response } = require('express');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
    test("200: returns api", () => 
    {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual({msg: "Connected to api"});
        })
    })
});

describe("GET /api/categories", () => {
    test("200: returns the categories table", () => 
    {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            response.body.categories.forEach(item => {
                expect.objectContaining({slug: expect.any(String),
                description: expect.any(String)})
            });
        })
    })
    
    test("200: ensures data is passed back as an array", () => {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            expect(response.body.categories.length).toEqual(4);
            expect(response.body.categories).toBeInstanceOf(Array);
        })
    })

    test("404: test for bad path", () => {
        return request(app)
        .get("/api/category")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('path not found');
        })
    })
})

describe("GET /api/reviews", () => {
    test("200: returns the reviews table", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            response.body.forEach(item => {
                expect.objectContaining(
                    {review_id: expect.any(Number),
                    title: expect.any(String),
                    review_body: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(Number)
                    }
                )
            })
        })
    })

    test("200: ensure that the datatype returned is an array of objects", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((response) => {
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toEqual(13);
        })
    })

    test("404: ensure when path is wrong, 404 is returned", () => {
        return request(app)
        .get("/api/review")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('path not found')
        })
    })
})

describe("GET /api/reviews/:review_id", () => {
    const review_id = 5;
    test("200: returns an array of objects from the reviews table", () => {
        return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then((response) => {
           response.body.forEach(item => {
               expect.objectContaining(
                   {
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    review_body: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(Number)
                   }
               )
           })
        })
    })

    test("200: returns an array that holds the correct reviews with corresponding ids", () => {
        return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then((response) => {
            response.body.forEach(item => {
                expect(review_id).toEqual(5);
            })
        })
    })

    test("400: make sure wrong endpoint errors are dealt with", () => {
        return request(app)
        .get(`/api/reviews/${"Hello"}`)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toEqual("Invalid input");
        })
    })

    test("404: make sure that if the path is wrong, a 404 error is returned", () => {
        return request(app)
        .get(`/api/review/${review_id}`)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual("path not found");
        })
    })
})

describe("GET /api/reviews/:review_id/comments", () => {
    const review_id = 3;
    test ("200: make sure that an array of comment objects are returned", () => {
        return request(app)
        .get(`/api/reviews/${review_id}/comments`)
        .expect(200)
        .then((response) => {
            response.body.forEach(item => {
                expect.objectContaining(
                    {
                        comment_id: expect.any(Number),
                        author: expect.any(String), 
                        votes: expect.any(Number),
                        created_at: expect.any(Number),
                        body: expect.any(String)
                    }
                )
            })
        })
    })

    test ("200: ensure that the returned comment object holds the correct review_id", () => {
        return request(app)
        .get(`/api/reviews/${review_id}/comments`)
        .expect(200)
        .then((response) => {
            response.body.forEach(item => {
                console.log(response.body.length);
                expect(response.body.length).toBe(3);
            })
        })
    })

    test("400: ensure when path is wrong, 400 is returned", () => {
        return request(app)
        .get(`/api/reviews/hello/comments`)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toEqual('Invalid input')
        })
    })

    test("404: when given a wrong path, 404 is returned", () => {
        return request(app)
        .get(`/api/reviews/${review_id}/comment`)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('path not found');
        })
    })
})

describe("PATCH /api/reviews/:review_id", () => {
    const review_id = 5;
    const patchObj = { inc_votes : 1 };
    test("200 successfully patches", () => {
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(patchObj)
        .expect(200)
        .then((response) => {
            response.body.reviews.forEach(item => {
                expect(response.body.reviews[0].votes).toBe(6);
            })
        })
    })

    test("200: returns the correct data that is requested", () => {
        return request(app)
        .patch(`/api/reviews/${review_id}`)
        .send(patchObj)
        .expect(200)
        .then((response) => {
            response.body.reviews.forEach(item => {
                expect.objectContaining(
                    {
                        title: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_img_url: expect.any(String),
                        review_body: expect.any(String),
                        category: expect.any(String),
                        created_at: expect.any(Number),
                        votes: expect.any(Number)
                    }
                )
            })
        })
    })

    test("400 testing for bad path", () => {
        return request(app)
        .patch(`/api/reviews/hello`)
        .send(patchObj)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe("Invalid input");
        })
    })

    test("404 testing for a path that doesnt exist", () => {
        return request(app)
        .patch(`/api/review/${review_id}`)
        .send(patchObj)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe("path not found");
        })
    })
})

describe.only("POST /api/reviews/:review_id/comments", () => {
    const review_id = 3;
    const postObj = {username: "davidmassey6", body: "I liked this a lot"};
    test("201: ensure that the object passed is inserted into the database", () => {
        return request(app)
        .post(`/api/reviews/${review_id}/comments`)
        .send(postObj)
        .expect(201)
        .then((response) => {
            console.log("response");
        })
    });
})