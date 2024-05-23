import { Route, Routes, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, Link as MuiLink } from "@mui/material";
import "../App.css";
import { styled } from "@mui/system";
import { DateTime } from "luxon";

// Material-UIのDataGridをカスタマイズするためのスタイル設定
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "&.MuiDataGrid-columnHeaders": {
    backgroundColor: "#43A047", // 緑色
  },
}));

// 顧客情報管理システムの一覧画面
const CustomerList = () => {
  // APIからデータを取得する
  const [customerList, setCustomerList] = useState([]);

  // ページがロードされたときにAPIからデータを取得する副作用を実行
  useEffect(() => {
    // APIからデータを取得する
    const url = "http://localhost:3001/api/get/customer_info";
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => setCustomerList(data))
      .catch((error) => console.log("データ取得エラー：", error));
  }, []); // 依存リストが空なので、最初のレンダリング時にのみ実行

    // DataGridの列定義
  const columns = [
    {
      field: "appointmentDate",
      headerName: "次回アポ日付",
      width: 150,
      valueFormatter: (params) => {
        // mysqlから取得した日付型のデータをYYYY-MM-ddの形式で表示する
        const date = new Date(params).toLocaleDateString();
        return date;
      },
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
        `¥${new Intl.NumberFormat("ja-JP").format(params)}`,
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
        <Link
          to={`/detail/${params.row.id}`}
          component="button"
          variant="body2"
        >
          詳細
        </Link>
      ),
    },
  ];

  return (
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
