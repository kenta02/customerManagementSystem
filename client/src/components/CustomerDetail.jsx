import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  addNegotiationHistory,
  getCustomerInfo,
  getNegotiationHistory,
  saveGoalValueToDB,
} from "../api/api";

// 詳細画面
const CustomerDetailPage = () => {
  const { id, customer_id } = useParams();

  // 顧客情報の詳細用のステート
  const [customerDetail, setCustomerDetail] = useState(null);
  // 商談履歴用のステート
  const [negotiationHistory, setNegotiationHistory] = useState([]);

  // //日付用のステート
  // const [selectedDate, setSelectedDate] = useState("");

  //日付用のステート
  const [negotiationDate, setNegotiationDate] = useState("");

  //商談履歴の状態をオブジェクトの配列として管理
  const [details, setDetails] = useState("");

  // todo用のステート
  const [todos, setTodos] = useState([]);

  // 目標数値用のステート
  const [targetValue, setTargetValue] = useState("");

  // APIから顧客情報を取得する
  useEffect(() => {
    // APIからデータを取得する
    const url = `http://localhost:3001/api/get/customer_info/${id}`;
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
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

  // 目標数値を取得する
  useEffect(() => {
    // APIからデータを取得する
    const url = `http://localhost:3001/api/get/customer_goals/${id}}`;
    console.log(url);
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data[0].goal_value);
        setTargetValue(data[0].goal_value);
      });
  }, [id]);

  // 商談履歴を取得する
  useEffect(() => {
    // APIからデータを取得する
    const url = `http://localhost:3001/api/get/negotiation_history/`;
    console.log(url);

    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setNegotiationHistory(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, customer_id]);

  // 商談履歴を取得する関数
  const fetchNegotiationHistory = () => {
    // APIからデータを取得する
    const url = `http://localhost:3001/api/get/negotiation_history/`;
    console.log(url);
    fetch(url, { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setNegotiationHistory(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 顧客情報がない場合ローディング中にする
  if (!customerDetail) {
    return <>Loading....</>;
  }

  // 追加ボタンがクリックされた時の処理
  const onClickAdd = () => {
    // inputエリアが空の場合は押しても何もしない。
    if (!negotiationDate || !details) {
      console.log("入力値が空のため追加できません");
      return;
    }

    // 新しい商談履歴オブジェクトを作成する
    const newTodo = { negotiationDate, details };

    // 新しい商談履歴をサーバーに送信
    addNegotiationHistory(id, negotiationDate, details)
      .then((data) => {
        // 追加後に商談履歴を再取得して表示する
        fetchNegotiationHistory();

        setTodos([...todos, newTodo]);
        // 入力フィールドをクリアする
        setNegotiationDate("");
        setDetails("");
      })
      .catch((error) => {
        console.log("商談履歴の追加に失敗しました。。。", error);
      });
  };

  // 目標数値をDBに保存する
  const onBlurSaveTargetValue = () => {
    if (targetValue === "" || isNaN(targetValue)) {
      //　入力エリアがなにも入っていない場合は何もしない
      console.log("目標数値が空です");
      return;
    }
    // 目標数値をサーバーに送信
    saveGoalValueToDB(id, targetValue).then((data) => {
      console.log(data);
    });
    console.log("目標数値をDBに保存しました。");
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
        <div>
          <div className="input-area">
            <label aria-label="negotiation-date">商談日：</label>
            <input
              type="date"
              id="negotiationDate"
              value={negotiationDate}
              onChange={(e) => setNegotiationDate(e.target.value)}
            />
            <br />
            <label aria-label="negotiation-details">商談内容：</label>
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
          <p>[履歴一覧]</p>
          <div className="todolist-area">
            <ul>
              {negotiationHistory.length > 0 ? (
                negotiationHistory.map((history, index) => (
                  <li key={index}>
                    商談日：{new Date(history.date).toLocaleDateString()} <br />
                    商談内容:{history.details}
                  </li>
                ))
              ) : (
                <li>表示するデータがありません</li>
              )}
            </ul>
          </div>

          {/* 目標数値エリア */}
          <div className="goal-area">
            <label aria-label="goal">目標数値:</label>
            <input
              type="number"
              id="targetGoals"
              value={isNaN(targetValue) ? "" : targetValue} // NaNの場合は空文字を表示
              onChange={(e) => setTargetValue(parseInt(e.target.value))} // 数値に変換
              onBlur={onBlurSaveTargetValue} // inputエリアへの入力終了時に目標数値をDBに保存
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPage;
