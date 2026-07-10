const bcrypt = require("bcrypt");

bcrypt.hash("mypass123", 10).then(hash => {
    console.log(hash);
});