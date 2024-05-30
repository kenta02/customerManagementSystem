import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  addNegotiationHistory,
  getCustomerInfo,
  getNegotiationHistory,
  saveGoalValueToDB,
  getCustomerGoals,
} from "../api/api";

// 詳細画面
const CustomerDetailPage = () => {
  // ルートパラメータから顧客IDを取得
  const { id } = useParams();

  // 各ステートを管理
  const [customerDetail, setCustomerDetail] = useState(null);
  const [negotiationHistory, setNegotiationHistory] = useState([]);
  const [negotiationDate, setNegotiationDate] = useState("");
  const [details, setDetails] = useState("");
  const [todos, setTodos] = useState([]);
  const [targetValue, setTargetValue] = useState("");

  // データを一括で取得する
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 顧客情報を取得
        const customerData = await getCustomerInfo(id);

        console.log("詳細：");
        console.log(customerDetail);

        if (customerData) {
          setCustomerDetail(customerData);
          console.log("Set Customer Detail:", customerData); // デバッグ用ログ
        } else {
          console.error("該当する顧客情報が見つかりませんでした。");
        }

        // 商談履歴を取得
        const negotiationData = await getNegotiationHistory();
        setNegotiationHistory(negotiationData);
      } catch (error) {
        console.error("データの取得に失敗しました。", error);
      }

      //　顧客目標数値を取得
      const goalData = await getCustomerGoals(id);
      console.log(goalData);
      if (goalData) {
        setTargetValue(goalData.goal_value);
      } else {
        console.error("目標数値が見つかりませんでした。");
      }
    };
    fetchData();
  }, [id]); //idが変更されるたびに実行

  // 商談履歴を再取得する
  const fetchNegotiationHistory = async () => {
    try {
      const negotiationData = await getNegotiationHistory();
      console.log("Negotiation History (refetch):", negotiationData); // デバッグ用ログ
      setNegotiationHistory(negotiationData);
    } catch (error) {
      console.error("顧客履歴の取得に失敗しました。", error);
    }
  };

  /*
   ****************************************
   * イベント処理
   ****************************************
   */
  // 追加ボタンがクリックされた時の処理
  const onClickAdd = async () => {
    // inputエリアが空の場合は押しても何もしない。
    if (!negotiationDate || !details) {
      console.log("入力値が空のため追加できません");
      return;
    }
    try {
      // 新しい商談履歴を追加
      await addNegotiationHistory(id, negotiationDate, details);
      //　追加後に商談履歴を再取得
      fetchNegotiationHistory();

      // TOdoリストに新しい商談履歴を追加する
      // const newTodo = { negotiationDate, details };
      //  setTodos([...todos, newTodo]);
      setTodos([...todos, { negotiationDate, details }]);

      //入力フィールドをクリア
      setNegotiationDate("");
      setDetails("");
    } catch (error) {
      console.error("商談履歴の追加に失敗しました。", error);
    }
  };

  // 目標数値をDBに保存する
  const onBlurSaveTargetValue = async () => {
    if (targetValue === "" || isNaN(targetValue)) {
      console.log("目標数値が空です");
      return;
    }
    try {
      // 目標数値をDBに保存
      await saveGoalValueToDB(id, targetValue);
      console.log("目標数値をDBに保存しました。");
    } catch (error) {
      console.error("目標数値の保存に失敗しました。", error);
    }
  };

  // 顧客情報がない場合にローディング中の表示を設定する
  if (!customerDetail) {
    return <div>Loading...</div>;
  }
  // 売上と目標数値の差分を計算
  const salesContract = customerDetail.salesContract;
  const goalValue = targetValue || 0;
  const difference = salesContract - goalValue;

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
            <br />
            <p>目標数値と現在数値までいくらか</p>

            {/* 現在の売上-目標数値を差し引いた数値を計算し画面に表示させる。 */}
            <p>残り：{difference}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPage;
