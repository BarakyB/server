const router = require("express").Router();
const connection = require ('./dbConfig')
const Query = require("./dbConfig");

router.get("/", async (req, res) => {
    const roles= await Query ('SELECT * FROM role' )
    res.json(roles)
});

module.exports = router;