const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const request = require("supertest");
const app = require("../app");

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

describe("GET /api/users", () => {
    test("200: returns all usernames from the users table", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
            expect.objectContaining(
                {
                    username: expect.any(String),
                    username: expect.any(String),
                    username: expect.any(String),
                    username: expect.any(String)
                }
            )
        })
    })

    test("200: ensure that the datatype returned is an array of objects", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
            expect(response.body).toBeInstanceOf(Object);
        })
    })

    test("404: ensure when path is wrong, 404 is returned", () => {
        return request(app)
        .get("/api/user")
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('path not found')
        })
    })
})

describe("GET /api/users/:username", () => {
    const username = "dav3rid";
    test("200: an object that has all values from user that links to the given username is returned", () => {
        return request(app)
        .get(`/api/users/${username}`)
        .expect(200)
        .then((response) => {
            expect.objectContaining({
                username: "dav3rid"
            })
        })
    })
})

describe("PATCH /api/reviews/:review_id", () => {
    test("200: Returns single object equal to specified review_id with altered votes", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.reviews[0].votes).toBe(6);
          expect(body.reviews[0].review_id).toBe(2);
          expect(typeof body.reviews[0]).toBe("object");
        });
    });
    test("400: Returns error message invalid input when inc_votes is not a number", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({ inc_votes: "a hundred" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
    test("400: Returns error message invalid input when review ID is not a number", () => {
      return request(app)
        .patch("/api/reviews/flipflop")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });

    
    // test("404: Returns page not found when review ID does not exist", () => {
        //         return request(app)
        //         .patch("/api/reviews/245245")
        //         .send({ inc_votes: 1 })
        //         .expect(404)
//         .then(({ body }) => {
    //             console.log(body, ">>>>>>>>>>>>>>>>")
    //             expect(body.msg).toBe(
        //                 "Page not found: Specified review ID does not exist."
        //           );
        //         });
        //     });
    });

    describe("POST /api/reviews/:review_id/comments", () => {
        test("201: Request body accepts an object with the properties username and body, responding with the posted comment", () => {
          return request(app)
            .post("/api/reviews/1/comments")
            .send({
              username: `mallionaire`,
              body: `Very nice review!`,
            })
            .expect(201)
            .then(({ body }) => {
                console.log(body)
              expect(body.comment.author).toBe("mallionaire");
              expect(body.comment).hasOwnProperty(
                "comment_id",
                "author",
                "review_id",
                "votes",
                "created_at",
                "body"
              );
            });
        });
        test("404: Returns page not found error message when review ID does not exist", () => {
          return request(app)
            .post("/api/reviews/3563563/comments")
            .send({
              username: `mallionaire`,
              body: `Very nice review!`,
            })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe(
                "Page not found: Specified review ID does not exist."
              );
            });
        });
        test("400: Returns invalid input error message when review ID is not a number", () => {
          return request(app)
            .post("/api/reviews/one/comments")
            .send({
              username: `mallionaire`,
              body: `Very nice review!`,
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid input: Syntax error in path.");
            });
        });
        test("400: Returns invalid input error message when input object missing a required key (username or body)", () => {
          return request(app)
            .post("/api/reviews/1/comments")
            .send({
              body: `Very nice review!`,
            })
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid input: Syntax error in path.");
            });
        });
        test("404: Returns page not found error message when username does not exist", () => {
          return request(app)
            .post("/api/reviews/1/comments")
            .send({
              username: `mrcool`,
              body: `Very nice review!`,
            })
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Page not found: Username does not exist.");
            });
        });
      });

      describe.only("DELETE /api/comments/:comment_id", () => {
        test("204: Responds with status 204 and no content", () => {
          return request(app).delete("/api/comments/1").expect(204);
        });
        test("204: Confirms that specified comment is deleted", () => {
          return request(app)
            .delete("/api/comments/1")
            .expect(204)
            .then(() => {
              return db.query(`SELECT * FROM comments`);
            })
            .then(({ rows }) => {
              expect(rows.length).toBe(5);
              expect(rows[0].comment_id).toBe(2);
            });
        });
        test("404: Returns page not found error message when comment ID does not exist", () => {
          return request(app)
            .delete("/api/comments/1363563")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toEqual("Page not found: comment ID does not exist.");
            });
        });
        test("400: Returns invalid input error message when ID is wrong type", () => {
          return request(app)
            .delete("/api/comments/snoopy")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toEqual("Invalid input");
            });
        });
      });