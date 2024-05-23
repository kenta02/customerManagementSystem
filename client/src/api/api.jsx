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

// 商談履歴を追加する
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
