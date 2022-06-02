const router = require("express").Router();
const connection = require ('./dbConfig')
const Query = require("./dbConfig");

router.post("/", async (req, res) => {
    const {userIn} = req.body
    const select_query = `select id, firstname from users where email = '${userIn.email}' and password = '${userIn.password}'`;
    const  existingUser = await Query(select_query);
    if (existingUser.length == 0) {
        return res
            .status(400)
            .json({ err: true, msg: "email Users or Password not find" });
    }
    else
        return res
            .status(200)
            .json(existingUser);
});



module.exports = router;
