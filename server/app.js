const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "express_db"
});

app.use(express.json());
app.use(cors());

app.get("/api/get/users", (req, res) => {
  const sqlSelect = "SELECT * FROM users ORDER BY id";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving users from the database");
    } else {
      res.send(result);
    }
  });
});

app.post("/api/insert/user", (req, res) => {
  const { name, email } = req.body;
  const sqlInsert = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sqlInsert, [name, email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to insert new user");
    } else {
      res.status(200).send("User added successfully");
    }
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
