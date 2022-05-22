const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: 'queueb4u',
});

connection.connect((err) => {
    if (err) {
      console.log('error');
      return;
    }
   
    console.log('mysql is connected');
  });

  const Query = (q, ...values) => {
    return new Promise((resolve, reject) => {
      connection.query(q, values, (err, results) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
  
  module.exports = Query
