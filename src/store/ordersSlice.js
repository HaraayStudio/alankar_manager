// src/store/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async () => {
    const accessToken = sessionStorage.getItem("token"); // check your token key
    const response = await api.get("/orders/getallorders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  }
);

// Update main order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }) => {
    const accessToken = sessionStorage.getItem("token");
    const response = await api.post(
      "/change/orderstatus",
      { orderId, status },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      return { orderId, status };
    }
    throw new Error("Failed to update status");
  }
);

// Update individual step status
export const updateOrderStepStatus = createAsyncThunk(
  "orders/updateOrderStepStatus",
  async ({ orderStepId, status }) => {
    const accessToken = sessionStorage.getItem("token");
    const response = await api.put(
      `/orderstep/updateorderstepstatus?orderStepId=${orderStepId}&OrderStepStatus=${status}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 200) {
      return { orderStepId, status };
    }
    throw new Error("Failed to update step status");
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const order = state.orders.find((order) => order.id === orderId);
        if (order) {
          order.status = status;
        }
      })
      .addCase(updateOrderStepStatus.fulfilled, (state, action) => {
        const { orderStepId, status } = action.payload;
        for (const order of state.orders) {
          const step = order.steps?.find((s) => s.id === orderStepId);
          if (step) {
            step.status = status;
            // Check if all steps completed
            const allCompleted = order.steps.every(
              (s) => s.status === "COMPLETED"
            );
            order.status = allCompleted ? "COMPLETED" : "IN_PROGRESS";
            break;
          }
        }
      });
  },
});

export default ordersSlice.reducer;
