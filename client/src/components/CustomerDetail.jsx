import React, { useState, useEffect } from "react";
import App from "../App";

import { useParams } from "react-router-dom";

// 詳細画面
const CustomerDetailPage = () => {
  const { id, customer_id } = useParams();

  // 顧客情報の詳細用のステート
  const [customerDetail, setCustomerDetail] = useState(null);
  // 商談履歴用のステート
  const [negotiationHistory, setNegotiationHistory] = useState([]);

  //日付用のステート
  const [selectedDate, setSelectedDate] = useState("");

  //日付用のステート
  const [negotiationDate, setNegotiationDate] = useState("");

  //商談内容用のステート
  const [details, setDetails] = useState("");

  // todo用のステート
  const [todos, setTodos] = useState([]);

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
        // console.log(data);

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

  // APIから商談履歴を取得する
  useEffect(() => {
    // APIから商談履歴のデータを取得する
    const url = `http://localhost:3001/api/get/negotiation_history/`;
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log("検証開始");
        // 顧客IDと一致するレコードから日付だけを抽出する
        const filteredData = data.filter(
          // 　日付だけ抽出する
          (item) => item.customer_id === parseInt(id)
        );

        // 日付の配列を作成する
        const negotiationDate = filteredData.map((index) => {
          return index.date;
        });

        // 日付をUTCからローカルタイムゾーンに変換する
        const firstDate = new Date(filteredData[0].date);
        const localDate = new Date(
          firstDate.getTime() - firstDate.getTimezoneOffset() * 60000
        );
        const filteredDate = localDate.toISOString().split("T")[0];

        if (data) {
          // 見つかったレコードをセットする
          setNegotiationHistory(data);
          // 抽出した最初の日付をinputエリアにセットする
          setSelectedDate(filteredDate);
        } else {
          console.log("該当するレコードは見つかりません。");
        }
      })
      .catch((error) => console.log(error));
  }, [customer_id, id]);

  if (!customerDetail) {
    return <>Loading....</>;
  }

  // 追加ボタンがクリックされた時に実行される関数
  const onClickAdd = () => {
    console.log("追加ボタン用の関数が実行されました");
    // inputエリアが空の場合は押しても何もしない。
    if (!negotiationDate || !details) {
      return;
    }

    // 新しい商談履歴オブジェクトを作成する;
    const newTodos = { negotiationDate, details };

    // スプレッド構文を使って新しい配列を作成する
    setTodos([...todos, newTodos]);

    // 入力フィールドをクリアする
    setNegotiationDate("");
    setDetails("");
  };

  return (
    <>
      <div>
        <h1>詳細画面</h1>
        <p>会社名：{customerDetail.companyName}</p>
        <p>会社の所在地：{customerDetail.companyAddress}</p>
        <p>
          資本金：¥
          {new Intl.NumberFormat("ja-JP").format(customerDetail.capital)}
        </p>
        <p>
          アポ日付：
          {new Date(customerDetail.appointmentDate).toLocaleDateString()}
        </p>
        <p>契約した売上：{customerDetail.salesContract}</p>
        <p>現在契約本数：{customerDetail.currentContracts}</p>
        <p>アポ先部署：{customerDetail.appointmentDepartment}</p>
        <p>担当者名：{customerDetail.representativeName}</p>
        <p>ふりがな：{customerDetail.representativeNameKana}</p>
        <p>
          会社URL：
          <a href={customerDetail.url} target="_blank" rel="noreferrer">
            {customerDetail.url}
          </a>
        </p>
        <h2>[商談履歴]</h2>
        ここには、商談履歴が表示されます。↓
        <br />
        ※商談履歴はTODOリストの形で追加していく形となります。
        <br />
        ※以下はモックデータです。
        {negotiationHistory.map((history, index) => (
          <div key={index}>
            <p>商談日：{new Date(history.date).toLocaleDateString()}</p>
            <p>商談内容：{history.details}</p>
          </div>
        ))}
        <p>
          ----------------------------------------------------------------------------------------
        </p>
        <p>ここから作成してください↓</p>
        <div>
          <div className="input-area">
            <label htmlFor="negotiation-date">商談日：</label>
            <input
              type="date"
              id="negotiationDate"
              value={negotiationDate}
              onChange={(e) => setNegotiationDate(e.target.value)}
            />
            <br />
            <label htmlFor="negotiation-details">商談内容：</label>
            <input
              type="text"
              id="negotiationDetails"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <br />
            <button onClick={onClickAdd}>追加</button>
          </div>
          <p>---------------------------------------------------------</p>
          <p>[履歴一覧]↓</p>

          <div className="todolist-area">
            <ul>
              {todos.map((todo, index) => (
                <li key={index}>
                  商談日：{todo.negotiationDate} <br />
                  商談内容：{todo.details}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPage;
