import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import CustomerDetailPage from "./components/CustomerDetail";
import CustomerList from "./components/CustomerList";

function App() {
  // // APIからデータを取得する
  // const [customerList, setCustomerList] = useState([]);

  // useEffect(() => {
  //   // APIからデータを取得する
  //   fetch("http://localhost:3001/api/get/customer_info", { method: "GET" })
  //     .then((response) => response.json())
  //     .then((data) => setCustomerList(data));
  // }, []);

  return (
    <BrowserRouter>
      <div className="App">
        {/* <CustomerList />
        <CustomerDetailPage /> */}

        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/detail/:id" element={<CustomerDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
