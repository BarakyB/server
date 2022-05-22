const router = require("express").Router();
const connection = require ('./dbConfig')
const Query = require("./dbConfig");

router.get("/", async (req, res) => {
 const user= await Query ('SELECT * FROM users' )
  res.json(user)
});

router.post("/", async (req, res) => {
  const {user} = req.body
  const insert_query = `INSERT INTO users ( firstName, lastName, email, password)
        VALUES ("${user.firstName}","${user.lastName}","${user.email}","${user.password}")`;
 const createdUser = await Query(insert_query);
    console.log(createdUser);
  res.json(createdUser)
});

router.put("/", async (req, res) => {
    const {user} = req.body
    const insert_query = `INSERT INTO users ( firstName, lastName, email, password)
        VALUES ("${user.firstName}","${user.lastName}","${user.email}","${user.password}")`;
    const createdUser = await Query(insert_query);
    console.log(createdUser);
    res.json(createdUser)
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const q = `DELETE FROM users WHERE id = ${id}`;
  const users = await Query(q);
  res.json(users);
});
module.exports = router;
