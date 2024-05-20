import React, { useState, useEffect } from "react";
import App from "../App";

import { useParams } from "react-router-dom";

// 詳細画面
const CustomerDetailPage = () => {
  const { id } = useParams();
  const [customerDetail, setCustomerDetail] = useState(null);

  // APIから顧客情報を取得する
  useEffect(() => {
    // APIからデータを取得する
    const url = `http://localhost:3001/api/get/customer_info/${id}`;
    console.log(url);

    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        //　特定のIDに対応するレコードを探す
        const record = data.find((item) => item.id === parseInt(id));
        if (record) {
          // 見つかったら単一のレコードをセットする
          setCustomerDetail(record);
        } else {
          console.log("該当するレコードは見つかりません。");
        }
      })
      .catch(
        (error) => {
          console.log(error);
        },
        [id]
      );
  }, [id]);

  if (!customerDetail) {
    return <>Loading....</>;
  }

  return (
    <>
      <div>
        <h1>詳細画面</h1>
        <p>{new Date(customerDetail.appointmentDate).toLocaleDateString()}</p>
        <p>{customerDetail.salesContract}</p>
        <p>{customerDetail.currentContracts}</p>
        <p>{customerDetail.companyName}</p>
        <p>{customerDetail.companyNameKana}</p>
        <p>¥{new Intl.NumberFormat("ja-JP").format(customerDetail.capital)}</p>
        <p>{customerDetail.employees}</p>
        <p>{customerDetail.appointmenpepartment}</p>
        <p>{customerDetail.representativeName}</p>
        <p>{customerDetail.representativeNameKana}</p>
        <p>
          <a href={customerDetail.url} target="_blank" rel="noreferrer">
            URL
          </a>
        </p>
      </div>
    </>
  );
};

export default CustomerDetailPage;
