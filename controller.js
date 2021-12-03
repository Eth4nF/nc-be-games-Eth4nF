const {fetchCategories, fetchReviews, fetchReviewById, fetchCommentsFromReviewId, updateReviewsWithId, insertCommentFromReviewId, removeCommentById, fetchUsers, fetchUsersByUsername} = require("./model.js");

exports.getApi = (req, res, next) => {
    console.log("In the controller");

    res.status(200).send({msg: "Connected to api"})
    .catch((err) => {
        next(err);
    });
};

exports.getCategories = (req, res, next) => {
    fetchCategories().then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err);
    });
};

exports.getReviews = (req, res, next) => {
    console.log("In the controller");

    fetchReviews().then((reviews) => {

        res.status(200).send(reviews)
    })
    .catch((err => {
        next(err);
    }));
};

exports.getReviewById = (req, res, next) => {
    console.log("In the controller");

    const {review_id} = req.params;

    fetchReviewById(review_id).then((reviews) => {

        res.status(200).send(reviews)
    })
    .catch((err) => {
        next(err);
    })
};

exports.getCommentsFromReviewId = (req, res, next) => {
    const {review_id} = req.params;
    console.log("In the controller");

    fetchCommentsFromReviewId(review_id).then((comments) => {
        res.status(200).send(comments)
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchReviewsWithId = (req, res, next) => {
    console.log("In the controller");

    const {review_id} = req.params;

    updateReviewsWithId(req.body, review_id).then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err);
    })
}

exports.postCommentFromReviewId = (req, res, next) => {
    console.log("In the controller");

    const {review_id} = req.params;

    insertCommentFromReviewId(req.body, review_id).then((reviews) => {
        res.status(201).send({reviews});
    })
    .catch((err) => {
        next(err);
    })
}

exports.deleteCommentById = (req, res, next) => {
    console.log("In the controller");

    const {comment_id} = req.params;

    removeCommentById(comment_id).then((comment) => {
        res.status(204).send({comment});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getUsers = (req, res, next) => {
    console.log("In the controller");

    fetchUsers().then((user) => {
        res.status(200).send({user});
    })
    .catch((err) => {
        next(err);
    })
}

exports.getUsersByUsername = (req, res, next) => {
    console.log("In the controller");

    const {username} = req.params;

    fetchUsersByUsername(username).then((user) => {
        res.status(200).send({user});
    })
    .catch((err) => {
        next(err);
    })
}