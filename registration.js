const router = require("express").Router();
const Query = require("./dbConfig");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  let { first_name, last_name, user_name, password, role } = req.body;
  if (!first_name || !last_name || !user_name || !password)
    return res.status(400).json({ err: true, msg: "missing details" });
  try {
    const select_query = `SELECT * from users where user_name = ?`;
    const user = await Query(select_query, user_name);
    const adminUser = {
      first_name: "admin",
      last_name: "admin1",
      user_name: "admin",
      password:1234
    };
    if (user.length > 0) {
      return res
        .status(401)
        .json({ err: true, msg: "Username is already taken" });
    }
    if (
      req.body.user_name == adminUser.user_name &&
      req.body.password == adminUser.password
    ) {
      role = "admin";
    } else {
      role = "user";
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const insert_query = `INSERT INTO users ( first_name, last_name, user_name, password, role)
        VALUES ("${first_name}","${last_name}","${user_name}","${hashedPassword}","${role}")`;
    await Query(insert_query);
    const select_updatedquery = `SELECT * from users where user_name = ?`;
    const updatedUser = await Query(select_updatedquery, user_name);
    res.status(201).json(updatedUser[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: true, msg: "server error" });
  }
});

module.exports = router;
