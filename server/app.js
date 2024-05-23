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

//--------------- 商談履歴テーブル--------------------------//

//商談履歴テーブル(negotiation_history)から履歴を全件取得する
app.get("/api/get/negotiation_history", (req, res) => {
  const sqlSelect = "SELECT * FROM negotiation_history ORDER BY customer_id";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send("Error retrieving negotiation_history from the database");
    } else {
      // 顧客情報をJSON形式でレスポンスとして返す
      res.send(result);
    }
  });
});
// 商談履歴テーブルから履歴を1件取得する
app.get("api/get/negotiation_history/:customer_id", (req, res) => {
  const sqlSelect = "SELECT * FROM negotiation_history WHERE customer_id = ?";
  db.query(sqlSelect, [req.params.customer_id], (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send("Error retrieving negotiation_history from the database");
    } else {
      // 顧客情報をJSON形式でレスポンスとして返す)
      res.send(result);
    }
  });
});

// 入力した内容を商談履歴テーブルに追加する[Todoリストの追加]
app.post("/api/add/negotiation_history", (req, res) => {
  const { customer_id, date, details } = req.body;
  const sqlInsert =
    "INSERT INTO negotiation_history(customer_id,date,details) VALUES(?,?,?)";
  db.query(sqlInsert, [customer_id, date, details], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("商談履歴の追加に失敗しました。");
    } else {
      res.status(200).send("商談履歴を追加しました。");
    }
  });
});

// 商談履歴を更新
app.put("/api/update/negotiation_history/:customer_id", (req, res) => {
  const { customer_id, date, details } = req.body;
  const sqlUpdate =
    "UPDATE negotiation_history SET customer_id = ?, date = ?, details = ? WHERE id = ?";
  db.query(
    sqlUpdate,
    [customer_id, date, details, req.params.customer_id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("商談履歴の更新に失敗しました。");
      } else {
        res.status(200).send("商談履歴の更新に成功しました。");
      }
    }
  );
});

// サーバーの起動
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
