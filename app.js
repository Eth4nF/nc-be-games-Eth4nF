const express = require("express");
const {getApi, getCategories, getReviews, getReviewById, getCommentsFromReviewId, patchReviewsWithId, postCommentByReviewId, deleteCommentById, getUsers, getUsersByUsername} = require("./controller.js");
const {handleCustomErrors, handlePsqlErrors, handleServerErrors} = require("./errors");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", getApi);

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.patch("/api/reviews/:review_id", patchReviewsWithId);

app.get("/api/reviews/:review_id/comments", getCommentsFromReviewId);

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUsersByUsername);

app.post("/api/reviews/:review_id/comments", postCommentByReviewId)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.all("/*", (req, res) => {
    res.status(404).send({msg: `path not found`})
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;