const db = require("../connection.js");
const format = require("pg-format");

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  
  return db.query("DROP TABLE IF EXISTS categories cascade;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users cascade;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS reviews cascade;");
  })
  .then(() => {
    return db.query("DROP TABLE IF EXISTS comments cascade;");
  })
  .then(() => {
    return db.query(`CREATE TABLE categories 
    (slug VARCHAR(255) PRIMARY KEY,
    description VARCHAR(255));`);
  })
  .then(() => {
    return db.query(`CREATE TABLE users 
    (username VARCHAR(55) PRIMARY KEY,
    avatar_url VARCHAR(2048),
    name VARCHAR (55));`);
  })
  .then(() => {
    return db.query(`CREATE TABLE reviews 
    (review_id SERIAL PRIMARY KEY,
    title VARCHAR, review_body VARCHAR,
    designer VARCHAR,
    review_img_url VARCHAR DEFAULT E'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    votes INT DEFAULT 0,
    category VARCHAR,
    FOREIGN KEY (category) REFERENCES categories(slug),
    owner VARCHAR,
    FOREIGN KEY (owner) REFERENCES users (username),
    created_at TIME DEFAULT CURRENT_TIMESTAMP);`);
  })
  .then(() => {
    return db.query(`CREATE TABLE comments 
    (comment_id SERIAL PRIMARY KEY,
    author VARCHAR,
    FOREIGN KEY (author) REFERENCES users (username),
    review_id INT,
    FOREIGN KEY (review_id) REFERENCES reviews (review_id),
    votes INT DEFAULT 0,
    created_at TIME DEFAULT CURRENT_TIMESTAMP,
    body TEXT NOT NULL);
    `)
  })
  .then(() => {
    const formattedCategoryData = categoryData.map((data) =>
    {
      return [data.slug, data.description];
    })

    const queryString = format('INSERT INTO categories VALUES %L RETURNING *', formattedCategoryData);

    return db.query(queryString);
  })
  .then(() => {
    const formattedUserData = userData.map((data) => 
    {
      return [data.username, data.avatar_url, data.name];
    })

    const queryString = format('INSERT INTO users VALUES %L RETURNING *;', formattedUserData);

    return db.query(queryString);
  })
  .then(() => {
    const formattedReviewData = reviewData.map((data) => {
      return [data.title, data.review_body, data.designer, data.review_img_url, data.votes, data.category, data.owner, data.created_at];
    })

    const queryString = format('INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, owner, created_at) VALUES %L RETURNING *;', formattedReviewData);

    return db.query(queryString);
  })
  .then(() => {
    const formattedCommentData = commentData.map((data) => {
      return [data.author, data.review_id, data.votes, data.created_at, data.body];
    })

    const queryString = format('INSERT INTO comments (author, review_id, votes, created_at, body) VALUES %L RETURNING *;', formattedCommentData);

    return db.query(queryString);
  })
};

module.exports = seed;
