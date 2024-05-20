const express = require("express");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "express_db",
});

app.use(express.json());
app.use(cors());

// 顧客情報を全件取得する
app.get("/api/get/customer_info", (req, res) => {
  const sqlSelect = "SELECT * FROM customer_info ORDER BY id";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving customer_info from the database");
    } else {
      // 顧客情報をJSON形式でレスポンスとして返す
      res.send(result);
    }
  });
});

// 顧客情報を1件取得する
app.get("/api/get/customer_info/:id", (req, res) => {
  const sqlSelect = "SELECT * FROM customer_info WHERE id = ?";
  db.query(sqlSelect, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving customer_info from the database");
    } else {
      // 顧客情報をJSON形式でレスポンスとして返す
      res.send(result);
    }
  });
});

// 顧客追加
app.post("/api/insert/customer_info", (req, res) => {
  const {
    appointmentDate,
    salesContract,
    companyName,
    companyNameKana,
    representativeName,
    capital,
    employees,
    url,
    currentContracts,
    appointmentDepartment,
  } = req.body;
  const sqlInsert =
    "INSERT INTO customer_info (appointmentDate,salesContract,companyName,companyNameKana,representativeName,capital,employees,url,currentContracts,appointmentDepartment) VALUES (?, ?)";
  db.query(
    sqlInsert,
    [
      appointmentDate,
      salesContract,
      companyName,
      companyNameKana,
      representativeName,
      capital,
      employees,
      url,
      currentContracts,
      appointmentDepartment,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Failed to insert new user");
      } else {
        res.status(200).send("User added successfully");
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
