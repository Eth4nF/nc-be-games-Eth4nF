const db = require("./db/connection");

exports.fetchCategories = () => {
    return db.query("SELECT * FROM categories;")
    .then((results) => {
        const categories = results.rows;

        if (!categories)
        {
            return Promise.reject({status: 404, message: "categories not found"});
        };

        return categories;
    });
};