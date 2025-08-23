
import axios from "axios";
import { BASE_URL } from "./constants";

// Update order step status
export async function updateOrderStepStatus(orderStepId, orderStepStatus) {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await axios.put(
    `${BASE_URL}/updateorderstepstatus`,
    {},
    {
      params: {
        orderStepId,
        OrderStepStatus: orderStepStatus
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
}
