import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  addNegotiationHistory,
  getCustomerInfo,
  getNegotiationHistory,
} from "../api/api";

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

  //商談履歴の状態をオブジェクトの配列として管理
  const [details, setDetails] = useState("");

  // todo用のステート
  const [todos, setTodos] = useState([]);

  // APIから顧客情報を取得する
  useEffect(() => {
    getCustomerInfo(id).then((data) => {
      //　特定のIDに対応するレコードを探す
      const record = data.find((item) => item.id === parseInt(id));
      if (record) {
        // 見つかったら単一のレコードをセットする
        setCustomerDetail(record);
      } else {
        console.log("該当するレコードは見つかりません。");
      }
    });
  });

  if (!customerDetail) {
    return <>Loading....</>;
  }

  // 追加ボタンがクリックされた時に実行される関数
  const onClickAdd = () => {
    // inputエリアが空の場合は押しても何もしない。
    if (!negotiationDate || !details) {
      console.log("入力値が空のため追加できません");
      return;
    }

    // 新しい商談履歴オブジェクトを作成する;
    const newTodos = { negotiationDate, details };

    // 新しいTODOをサーバー側に送信
    addNegotiationHistory(id, negotiationDate, details)
      .then((data) => {
        setTodos([...todos, newTodos]);
        // 入力フィールドをクリアする
        setNegotiationDate("");
        setDetails("");
      })
      .catch((error) => {
        console.log("商品履歴の追加に失敗しました。。。", error);
      });
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
