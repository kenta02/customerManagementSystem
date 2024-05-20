import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import CustomerDetailPage from "./components/CustomerDetailPage";

function App() {
  // APIからデータを取得する
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    // APIからデータを取得する
    fetch("http://localhost:3001/api/get/customer_info", { method: "GET" })
      .then((response) => response.json())
      .then((data) => setCustomerList(data));
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <h1>一覧画面</h1>
        {/* テーブルレイアウトを作成する */}
        {/* テーブルの見出しは以下を想定している */}
        {/* 次回アポ日付 契約した売上 現在契約本数 会社名 ふりがな 資本金 従業員数
      アポ先部署 担当者名 ふりがな URL */}

        <table className="customerList">
          <thead>
            <tr>
              <th>次回アポ日付</th>
              <th>契約した売上</th>
              <th>現在契約本数</th>
              <th>会社名</th>
              <th>ふりがな</th>
              <th>資本金</th>
              <th>従業員数</th>
              <th>アポ先部署</th>
              <th>担当者名</th>
              <th>ふりがな</th>
              <th>URL</th>
              <th>詳細</th>
            </tr>
          </thead>
          <tbody>
            {/* テーブルの中身を作成する */}
            {customerList.map((customer) => (
              // 顧客数だけtr要素を作成する
              <tr key={customer.id}>
                {/* 各td要素を作成する */}
                <td>
                  {new Date(customer.appointmentDate).toLocaleDateString()}
                </td>
                <td>{customer.salesContract}</td>
                <td>{customer.currentContracts}</td>
                <td>{customer.companyName}</td>
                <td>{customer.companyNameKana}</td>
                <td>
                  ¥{new Intl.NumberFormat("ja-JP").format(customer.capital)}
                </td>
                <td>{customer.employees}</td>
                <td>{customer.appointmentDepartment}</td>
                <td>{customer.representativeName}</td>
                <td>{customer.representativeNameKana}</td>
                <td>
                  <a href={customer.url} target="_blank" rel="noreferrer">
                    URL
                  </a>
                </td>
                <td>
                  {/* idをもたせた上でリンクを設定して詳細画面へ遷移させる */}
                  {/* <Link to={`/detail?id=${customer.id}`}>詳細</Link> */}
                  <Link to={`/detail/${customer.id}`}>詳細</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Routes>
          <Route path="/detail/:id" element={<CustomerDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
