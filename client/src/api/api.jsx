import axios from "axios";

// 顧客情報を取得する
export const getCustomerInfo = async (id) => {
  const url = `http://localhost:3001/api/get/customer_info/${id}`;

  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("顧客情報の取得に失敗しました。");
  }
};

export const getNegotiationHistory = async (id) => {
  const url = `http://localhost:3001/api/negotiation_history/`;

  try {
    const response = await fetch(url, { method: "GET" });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("商談履歴のÚ取得に失敗しました。");
  }
};

// DBに商談履歴を追加する
export const addNegotiationHistory = async (customer_id, date, details) => {
  const url = `http://localhost:3001/api/add/negotiation_history`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer_id, date, details }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    throw new Error("商談履歴の追加に失敗しました。");
  }
};

// DBの目標数値を更新する。（※データがない場合は追加することとする）
export const saveGoalValueToDB = async (customer_id, goal_value) => {
  const url = `http://localhost:3001/api/set/customer_goals/${customer_id}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer_id, goal_value }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    throw new Error("目標数値の更新に失敗しました。");
  }
};
