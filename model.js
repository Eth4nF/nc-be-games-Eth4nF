const db = require("./db/connection");
const format = require("pg-format");

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

exports.fetchReviews = (category) => {
    console.log("In the model");

    return db.query('SELECT * FROM reviews;').then(({rows}) => {
        let reviews = rows[0];

        if (category) {
            
        }

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

  exports.postComment = (req) => {
    const { review_id } = req.params;
    const { body } = req;
    const regex = /[0-9]/;
  
    if (!review_id.match(regex)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid input: Syntax error in path.",
      });
    }
    if (!body.username) {
      return Promise.reject({
        status: 400,
        msg: "Invalid input: Syntax error in path.",
      });
    }
    if (!body.body) {
      return Promise.reject({
        status: 400,
        msg: "Invalid input: Syntax error in path.",
      });
    }
    if (
      body.username !== "mallionaire" &&
      body.username !== "philippaclaire9" &&
      body.username !== "bainesface" &&
      body.username !== "dav3rid" &&
      body.username !== "grumpy19" &&
      body.username !== "happyamy2016" &&
      body.username !== "cooljmessy" &&
      body.username !== "weegembump" &&
      body.username !== "jessjelly" &&
      body.username !== "tickle122"
    ) {
      return Promise.reject({
        status: 404,
        msg: "Page not found: Username does not exist.",
      });
    }
    body.author = body.username;
    delete body.username;
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
        let queryStr = format(
          `
                  INSERT INTO comments (body, votes, author, review_id) 
                  VALUES %L 
                  RETURNING *;`,
          [[body.body, 0, body.author, review_id]]
        );
        return db.query(queryStr).then(({ rows }) => {
          return rows[0];
        });
      });
  };

  exports.deleteComment = (req) => {
	const { comment_id } = req.params;
	if (typeof Number(comment_id) !== "number") {
		return Promise.reject({
			status: 400,
			msg: "Invalid input: comment ID is a number.",
		});
	}
	return db
		.query(
			`SELECT * FROM comments 
			WHERE comment_id = $1`,
			[comment_id]
	)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "Page not found: comment ID does not exist.",
				});
			}
		})
		.then(() => {
			return db.query(
				`DELETE FROM comments 
				WHERE comment_id = $1`,
				[comment_id]
			);
		});
};