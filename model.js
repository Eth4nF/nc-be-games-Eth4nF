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

exports.fetchReviews = async ({sort_by = 'created_at', order = 'desc', category, owner}) => {
    const validSortBy = await validateSortBy(sort_by, [
        'created_at',
        'votes',
        'title',
        'comment_count',
        'owner',
        'designer',
      ]);
      const validOrder = await validateOrder(order);
      const dbQueryParams = [];
    
      let queryStr = `SELECT reviews.*,
      COUNT(comments.comment_id) AS comment_count
      FROM reviews
      LEFT JOIN comments ON comments.review_id = reviews.review_id
    `;
    
      if (category) {
        dbQueryParams.push(category);
        queryStr += `WHERE reviews.category ILIKE $${dbQueryParams.length}`;
      }
    
      if (owner) {
        dbQueryParams.push(owner);
        queryStr += `${category ? 'AND ' : ''}WHERE reviews.owner ILIKE $${
          dbQueryParams.length
        }`;
      }
    
      queryStr += `
      GROUP BY reviews.review_id
      ORDER BY ${validSortBy} ${validOrder};
      `;
    
      const reviews = await db
        .query(queryStr, dbQueryParams)
        .then((result) => result.rows);
    
      if (!reviews.length) {
        if (category) await checkExists('categories', 'slug', category);
        if (owner) await checkExists('users', 'username', owner);
      }
      return reviews;
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

    return db.query('INSERT INTO comments (author, body) SELECT VALUES (author, body) FROM temp_comments WHERE review_id = $3 RETURNING *;', [obj.username, obj.body, review_id]).then(({rows}) => {
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

exports.removeCommentById = (comment_id) => {
    console.log("In the model");

    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id]).then(({rows}) => {
        console.log(rows);
        if (!rows[0]) {
            return Promise.reject({
                status:400,
                msg: "Wrong id"
            })
        }
        else
        return rows;
    })
}

exports.fetchUsers = () => {
    console.log("In the model");

    return db.query('SELECT username FROM users;').then(({rows}) => {
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

exports.fetchUsersByUsername = (username) => {
    console.log("In the model");

    return db.query('SELECT * FROM users WHERE username = $1;', [username]).then(({rows}) => {
        if (!rows[0]) {
            return Promise.reject({
                status:400,
                msg: "Wrong id"
            })
        }
        else
        return rows;
    })
}

exports.patchVotes = (inc_votes, review_id) => {
    return db
      .query(`SELECT * FROM reviews`)
      .then(({ rows }) => {
        if (review_id > rows.length) {
          return Promise.reject({
            status: 404,
            msg: "Page not found: Specified review ID does not exist.",
          });
        }
      })
      .then(() => {
        return db
          .query(
            `UPDATE reviews 
                  SET votes = votes + $1 
                  WHERE review_id = $2;`,
            [inc_votes, review_id]
          )
          .then(() => {
            return db.query(
              `SELECT * FROM reviews 
                      WHERE review_id = $1;`,
              [review_id]
            );
          })
          .then(({ rows }) => {
            return rows[0];
          });
      });
  };