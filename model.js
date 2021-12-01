const db = require("./db/connection");

exports.fetchCategories = () => {
    console.log("In the model");

    return db.query('SELECT * FROM categories;').then(({rows}) => {
        category = rows[0];

        if (!category) {
            return Promise.reject({
                status: 404,
                msg: `No category found`
            });
        }
        else
        // console.log('result:', result);
        return rows;
    })
};

exports.fetchReviews = () => {
    console.log("In the model");

    return db.query('SELECT * FROM reviews;').then(({rows}) => {
        let reviews = rows[0];

        if (!reviews) {
            return Promise.reject({
                status: 404,
                msg: `No review found`
            })
        }
        else
        // console.log('result', result);
        return rows;
    })
};

exports.fetchReviewById = (review_id) => {
    console.log("In the model", review_id);

    return db.query('SELECT * FROM reviews WHERE review_id = $1;', [review_id]).then(({rows}) => {
        let reviews = rows[0];
        if (!reviews) {
            return Promise.reject({
                status: 400,
                msg:`Wrong id`
            })
        }
        else
        // console.log('result', result.rows);
        return rows;
    })
};

exports.fetchCommentsFromReviewId = (review_id) => {
    console.log("In the model", review_id);

    let values = [review_id];
    return db.query('SELECT (comment_id, author, votes, created_at, body) FROM comments WHERE review_id = $1;', values).then(({rows}) => {
        console.log(rows);
        if (!rows[0]) {
            return Promise.reject({
                status: 400,
                msg: `Wrong id`
            })
        }
        else
        return rows;
    })
}

exports.updateReviewsWithId = (obj, review_id) => {
    console.log("In the model");
    
    return db.query('UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;', [obj.inc_votes, review_id]).then(({rows}) => {
        console.log(rows);
        if (!rows[0]) {
            return Promise.reject({
                status: 400,
                msg: "Wrong id"
            })
        }
        else 
        return rows;
    })
};

exports.insertCommentFromReviewId = (obj, review_id) => {
    console.log("In the model");

    return db.query('DROP TABLE IF EXISTS temp_comments; CREATE TABLE temp_comments (author VARCHAR PRIMARY KEY, body VARCHAR); INSERT INTO temp_comments VALUES ($1, $2); INSERT INTO comments (author, body) SELECT VALUES (author, body) FROM temp_comments WHERE review_id = $3 RETURNING *;', [obj.username, obj.body, review_id]).then(({rows}) => {
        console.log(rows);
        if (!rows[0]) {
            return Promise.reject({
                status: 400,
                msg: "Wrong id"
            })
        }
        else
         return rows;
    })
}