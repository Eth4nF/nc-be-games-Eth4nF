const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require("supertest");
const app = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
    test("200: returns an object with key of categories", () => 
    {
        return request(app)
        .get("/api/categories")
        .expect(200)
        .then((response) => {
            console.log(response.body);
            // expect(response.body).toEqual()
        })
    })
})