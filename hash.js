const bcrypt = require("bcrypt");

bcrypt.hash("apple123", 10).then(hash => {
    console.log(hash);
});