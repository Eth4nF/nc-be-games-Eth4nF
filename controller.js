const {fetchCategories} = require("./model.js");

exports.getCategories = () => {
    console.log("In the controller");

    fetchCategories().then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err);
    });
};