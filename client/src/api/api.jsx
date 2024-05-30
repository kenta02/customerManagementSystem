import axios from "axios";

const api = axios.create({
  baseURL: `http://localhost:3001/api`,
  headers: { "Content-Type": "application/json" },
});

// 顧客情報を取得する
export const getCustomerInfo = async (id) => {
  try {
    const response = await api.get(`/get/customer_info/${id}`);
    // response.data にサーバーからのレスポンスデータが含まれる
    console.log("ログ検証：");
    console.log(response.data);
    return response.data[0];
  } catch (error) {
    console.error(error);
    throw new Error("顧客情報の取得に失敗しました。");
  }
};

export const getNegotiationHistory = async (id) => {
  try {
    const response = await api.get(`/get/negotiation_history`);
    console.log("API getNegotiationHistory response:", response.data);
    return response.data; //商談履歴データを返す
  } catch (error) {
    console.error("商談履歴の取得に失敗しました。", error);
    throw new Error("商談履歴の取得に失敗しました。");
  }
};

// DBに商談履歴を追加する
export const addNegotiationHistory = async (customer_id, date, details) => {
  try {
    const response = await api.post(`/add/negotiation_history`, {
      customer_id,
      date,
      details,
    });
    // 追加された商談履歴のデータを返す
    return response.data;
  } catch (error) {
    console.error("商談履歴の追加に失敗しました。", error);
    throw new Error("商談履歴の追加に失敗しました。");
  }
};

// DBの目標数値を更新する。（※データがない場合は追加することとする）
export const saveGoalValueToDB = async (customer_id, goal_value) => {
  try {
    const response = await api.post(`/set/customer_goals/${customer_id}`, {
      goal_value,
    });
    // 更新された目標数値のデータを返す
    return response.data;
  } catch (error) {
    console.error("目標数値の更新に失敗しました。", error);
    throw new Error("目標数値の更新に失敗しました。");
  }
};

// 顧客目標数値を取得する
export const getCustomerGoals = async (id) => {
  try {
    const response = await api.get(`/get/customer_goals/${id}`);
    return response.data[0];
  } catch (error) {
    console.error("顧客目標数値の取得に失敗しました。", error);
    throw new Error("顧客目標数値の取得に失敗しました。");
  }
};
