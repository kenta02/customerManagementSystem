import { Route, Routes, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Link as MuiLink } from "@mui/material";
import "../App.css";

const columns = [
  {
    field: "appointmentDate",
    headerName: "次回アポ日付",
    width: 150,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  },
  { field: "salesContract", headerName: "契約した売上", width: 150 },
  { field: "currentContracts", headerName: "現在契約本数", width: 150 },
  { field: "companyName", headerName: "会社名", width: 150 },
  { field: "companyNameKana", headerName: "会社名ふりがな", width: 150 },
  {
    field: "capital",
    headerName: "資本金",
    width: 150,
    valueFormatter: (params) =>
      `¥${new Intl.NumberFormat("ja-JP").format(params.value)}`,
  },
  { field: "employees", headerName: "従業員数", width: 150 },
  { field: "appointmentDepartment", headerName: "アポ先部署", width: 150 },
  { field: "representativeName", headerName: "担当者名", width: 150 },
  {
    field: "representativeNameKana",
    headerName: "担当者名ふりがな",
    width: 150,
  },
  {
    field: "url",
    headerName: "URL",
    width: 150,
    renderCell: (params) => (
      <MuiLink href={params.value} target="_blank" rel="noopener noreferrer">
        {params.value}
      </MuiLink>
    ),
  },
  {
    field: "detail",
    headerName: "詳細",
    width: 150,
    renderCell: (params) => (
      <Link to={`/detail/${params.row.id}`} component="button" variant="body2">
        詳細
      </Link>
    ),
  },
];

// 顧客情報管理システムの一覧画面
const CustomerList = () => {
  // APIからデータを取得する
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    // APIからデータを取得する
    fetch("http://localhost:3001/api/get/customer_info", { method: "GET" })
      .then((response) => response.json())
      .then((data) => setCustomerList(data));
  }, []);

  return (
    // <div>
    //   <h1>一覧画面</h1>

    //   <table className="customerList">
    //     <thead>
    //       <tr>
    //         <th>次回アポ日付</th>
    //         <th>契約した売上</th>
    //         <th>現在契約本数</th>
    //         <th>会社名</th>
    //         <th>ふりがな</th>
    //         <th>資本金</th>
    //         <th>従業員数</th>
    //         <th>アポ先部署</th>
    //         <th>担当者名</th>
    //         <th>ふりがな</th>
    //         <th>URL</th>
    //         <th>詳細</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {/* テーブルの中身を作成する */}
    //       {customerList.map((customer) => (
    //         // 顧客数だけtr要素を作成する
    //         <tr key={customer.id}>
    //           {/* 各td要素を作成する */}
    //           <td>{new Date(customer.appointmentDate).toLocaleDateString()}</td>
    //           <td>{customer.salesContract}</td>
    //           <td>{customer.currentContracts}</td>
    //           <td>{customer.companyName}</td>
    //           <td>{customer.companyNameKana}</td>
    //           <td>
    //             ¥{new Intl.NumberFormat("ja-JP").format(customer.capital)}
    //           </td>
    //           <td>{customer.employees}</td>
    //           <td>{customer.appointmentDepartment}</td>
    //           <td>{customer.representativeName}</td>
    //           <td>{customer.representativeNameKana}</td>
    //           <td>
    //             <a href={customer.url} target="_blank" rel="noreferrer">
    //               URL
    //             </a>
    //           </td>
    //           <td>
    //             {/* idをもたせた上でリンクを設定して詳細画面へ遷移させる */}
    //             <Link to={`/detail/${customer.id}`}>詳細</Link>
    //           </td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>

    <Container className="customerList">
      <Typography variant="h2" gutterBottom>
        一覧画面
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={customerList}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </Container>
  );
};

export default CustomerList;
