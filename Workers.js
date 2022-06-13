const router = require("express").Router();
const connection = require ('./dbConfig')
const Query = require("./dbConfig");

router.get("/", async (req, res) => {
    const {role} = req.query;

    const workers= await Query ('select * from workers where idworkers in (SELECT idworker FROM workersrole where idrole=?)', role )
    res.json(workers)
});



module.exports = router;