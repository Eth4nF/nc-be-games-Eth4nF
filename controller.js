const {fetchCategories, fetchReviews, fetchReviewById, fetchCommentsFromReviewId, updateReviewsWithId, deleteComment, fetchUsers, fetchUsersByUsername, patchVotes, postComment} = require("./model.js");

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
    fetchReviews(req.query).then((reviews) => {
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

exports.patchReviews = (req, res, next) => {
    const { inc_votes } = req.body;
    const { review_id } = req.params;
    patchVotes(inc_votes, review_id)
      .then((response) => {
        res.status(200).send({ review: response });
      })
      .catch((err) => {
        next(err);
      });
  };

  exports.postCommentByReviewId = (req, res, next) => {
    postComment(req)
      .then((response) => {
        res.status(201).send({ comment: response });
      })
      .catch((err) => {
        next(err);
      });
  };

  exports.deleteCommentById = (req, res, next) => {
    deleteComment(req).then(() => {
        res.status(204).send()
    })
        .catch((err) => {
            next(err)
        });
};