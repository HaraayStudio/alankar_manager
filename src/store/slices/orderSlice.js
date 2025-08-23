// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import {
// //   getAllOrders, createOrder, getOrderById, updateOrder, deleteOrder
// // } from "../../api/orderApi";

// // // ---- Thunks ----
// // export const fetchOrders = createAsyncThunk(
// //   "orders/fetchAll",
// //   async (token) => {
// //     const response = await getAllOrders(token);
// //     return response.data.data;
// //   }
// // );

// // export const addOrder = createAsyncThunk(
// //   "orders/add",
// //   async ({ order, token }) => {
// //     const response = await createOrder(order, token);
// //     return response.data.data;
// //   }
// // );

// // export const updateOrderThunk = createAsyncThunk(
// //   "orders/update",
// //   async ({ orderId, orderData, token }) => {
// //     const response = await updateOrder(orderId, orderData, token);
// //     return response.data.data;
// //   }
// // );

// // export const deleteOrderThunk = createAsyncThunk(
// //   "orders/delete",
// //   async ({ orderId, token }) => {
// //     await deleteOrder(orderId, token);
// //     return orderId;
// //   }
// // );

// // // ---- Slice ----
// // const orderSlice = createSlice({
// //   name: "orders",
// //   initialState: {
// //     list: [],
// //     loading: false,
// //     error: null,
// //   },
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       // Fetch all
// //       .addCase(fetchOrders.pending, (state) => { state.loading = true; })
// //       .addCase(fetchOrders.fulfilled, (state, action) => {
// //         state.list = action.payload || [];
// //         state.loading = false;
// //       })
// //       .addCase(fetchOrders.rejected, (state) => { state.loading = false; })
// //       // Add
// //       .addCase(addOrder.fulfilled, (state, action) => {
// //         if (action.payload) state.list.unshift(action.payload);
// //       })
// //       // Update
// //       .addCase(updateOrderThunk.fulfilled, (state, action) => {
// //         state.list = state.list.map(o =>
// //           o.id === action.payload.id ? action.payload : o
// //         );
// //       })
// //       // Delete
// //       .addCase(deleteOrderThunk.fulfilled, (state, action) => {
// //         state.list = state.list.filter(o => o.id !== action.payload);
// //       });
// //   }
// // });

// // export default orderSlice.reducer;


// // src/store/slices/orderSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getAllOrders,
//   getOrderById,
//   createOrder,
//   updateOrder,
//   deleteOrder,
//   updateOrderStepStatus,
//   updateOrderStatus,
// } from "../../api/orderApi";

// export const fetchOrders = createAsyncThunk(
//   "orders/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getAllOrders();
//       return response.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
//     }
//   }
// );

// export const fetchOrder = createAsyncThunk(
//   "orders/fetchById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await getOrderById(id);
//       return response.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch order");
//     }
//   }
// );

// export const addOrder = createAsyncThunk(
//   "orders/add",
//   async ({ order, isOldClient, images }, { rejectWithValue }) => {
//     try {
//       const response = await createOrder(order, isOldClient, images);
//       return response.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to add order");
//     }
//   }
// );

// export const updateOrderThunk = createAsyncThunk(
//   "orders/update",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const response = await updateOrder(id, data);
//       return response.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to update order");
//     }
//   }
// );

// export const deleteOrderThunk = createAsyncThunk(
//   "orders/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await deleteOrder(id);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to delete order");
//     }
//   }
// );

// export const updateOrderStepStatusThunk = createAsyncThunk(
//   "orders/updateStepStatus",
//   async ({ orderStepId, orderStepStatus }, { rejectWithValue }) => {
//     try {
//       const response = await updateOrderStepStatus(orderStepId, orderStepStatus);
//       return { orderStepId, status: orderStepStatus, data: response };
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to update step status");
//     }
//   }
// );

// export const updateOrderStatusThunk = createAsyncThunk(
//   "orders/updateStatus",
//   async ({ orderId, status }, { rejectWithValue }) => {
//     try {
//       const response = await updateOrderStatus(orderId, status);
//       return { orderId, status, data: response.data };
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to update order status");
//     }
//   }
// );

// const orderSlice = createSlice({
//   name: "orders",
//   initialState: {
//     list: [],
//     currentOrder: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearCurrentOrder: (state) => {
//       state.currentOrder = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all orders
//       .addCase(fetchOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrders.fulfilled, (state, action) => {
//         state.list = action.payload || [];
//         state.loading = false;
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Fetch single order
//       .addCase(fetchOrder.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchOrder.fulfilled, (state, action) => {
//         state.currentOrder = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Add order
//       .addCase(addOrder.fulfilled, (state, action) => {
//         if (action.payload) {
//           state.list.unshift(action.payload);
//         }
//       })
//       .addCase(addOrder.rejected, (state, action) => {
//         state.error = action.payload;
//       })
      
//       // Update order
//       .addCase(updateOrderThunk.fulfilled, (state, action) => {
//         const updatedOrder = action.payload;
//         if (updatedOrder && updatedOrder.id) {
//           const idx = state.list.findIndex((o) => o.id === updatedOrder.id);
//           if (idx !== -1) {
//             state.list[idx] = updatedOrder;
//           }
//           if (state.currentOrder?.id === updatedOrder.id) {
//             state.currentOrder = updatedOrder;
//           }
//         }
//       })
//       .addCase(updateOrderThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       })
      
//       // Delete order
//       .addCase(deleteOrderThunk.fulfilled, (state, action) => {
//         state.list = state.list.filter((order) => order.id !== action.payload);
//         if (state.currentOrder?.id === action.payload) {
//           state.currentOrder = null;
//         }
//       })
//       .addCase(deleteOrderThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       })
      
//       // Update order status
//       .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
//         const { orderId, status } = action.payload;
//         const order = state.list.find((o) => o.id === orderId);
//         if (order) {
//           order.status = status;
//         }
//         if (state.currentOrder?.id === orderId) {
//           state.currentOrder.status = status;
//         }
//       })
//       .addCase(updateOrderStatusThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       })
      
//       // Update order step status
//       .addCase(updateOrderStepStatusThunk.fulfilled, (state, action) => {
//         const { orderStepId, status } = action.payload;
        
//         // Update in list
//         for (const order of state.list) {
//           const step = order.steps?.find((s) => s.id === orderStepId);
//           if (step) {
//             step.status = status;
//             // Check if all steps completed
//             const allCompleted = order.steps.every((s) => s.status === "COMPLETED");
//             order.status = allCompleted ? "COMPLETED" : "IN_PROGRESS";
//             break;
//           }
//         }
        
//         // Update current order if it matches
//         if (state.currentOrder) {
//           const step = state.currentOrder.steps?.find((s) => s.id === orderStepId);
//           if (step) {
//             step.status = status;
//             const allCompleted = state.currentOrder.steps.every((s) => s.status === "COMPLETED");
//             state.currentOrder.status = allCompleted ? "COMPLETED" : "IN_PROGRESS";
//           }
//         }
//       })
//       .addCase(updateOrderStepStatusThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError, clearCurrentOrder } = orderSlice.actions;
// export default orderSlice.reducer;

// src/store/slices/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStepStatus,
  updateOrderStatus,
  addOrderToPostSales,
} from "../../api/orderApi";

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllOrders();
      console.log("📦 Orders API response:", response.data);
      return response.data.data || response.data;
    } catch (err) {
      console.error("❌ Orders fetch error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// Fetch single order
export const fetchOrder = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getOrderById(id);
      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch order");
    }
  }
);

// Add new order
export const addOrder = createAsyncThunk(
  "orders/add",
  async ({ order, isOldClient, images }, { rejectWithValue }) => {
    try {
      const response = await createOrder(order, isOldClient, images);
      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add order");
    }
  }
);

// Update existing order - for UpdateOrderPopup
export const updateOrderThunk = createAsyncThunk(
  "orders/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log("🔧 Updating order:", { id, data });
      const response = await updateOrder(id, data);
      console.log("✅ Order update response:", response.data);
      return { id, updatedData: response.data.data || response.data };
    } catch (err) {
      console.error("❌ Order update error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to update order");
    }
  }
);

// Delete order - for UpdateOrderPopup
export const deleteOrderThunk = createAsyncThunk(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      console.log("🗑️ Deleting order:", id);
      await deleteOrder(id);
      console.log("✅ Order deleted successfully");
      return id;
    } catch (err) {
      console.error("❌ Order delete error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to delete order");
    }
  }
);

// Add order to PostSales - for new orders in UpdateOrderPopup
export const addOrderToPostSalesThunk = createAsyncThunk(
  "orders/addToPostSales",
  async ({ srNumber, order, images }, { rejectWithValue }) => {
    try {
      console.log("➕ Adding order to PostSales:", { srNumber, order, images: images?.length });
      const response = await addOrderToPostSales(srNumber, order, images);
      console.log("✅ Order added to PostSales:", response.data);
      return response.data.data || response.data;
    } catch (err) {
      console.error("❌ Add order to PostSales error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to add order to PostSales");
    }
  }
);

// Update order step status
export const updateOrderStepStatusThunk = createAsyncThunk(
  "orders/updateStepStatus",
  async ({ orderStepId, orderStepStatus }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStepStatus(orderStepId, orderStepStatus);
      return { orderStepId, status: orderStepStatus, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update step status");
    }
  }
);

// Update order status
export const updateOrderStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await updateOrderStatus(orderId, status);
      return { orderId, status, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update order status");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    currentOrder: null,
    loading: false,
    operationLoading: false, // For individual operations like update/delete
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setOperationLoading: (state, action) => {
      state.operationLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add order
      .addCase(addOrder.pending, (state) => {
        state.operationLoading = true;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
        }
        state.operationLoading = false;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.error = action.payload;
        state.operationLoading = false;
      })
      
      // Update order - specifically for UpdateOrderPopup
      .addCase(updateOrderThunk.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(updateOrderThunk.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        
        // Update in the list
        const idx = state.list.findIndex((o) => o.id === id);
        if (idx !== -1 && updatedData) {
          state.list[idx] = updatedData;
        }
        
        // Update current order if it matches
        if (state.currentOrder?.id === id && updatedData) {
          state.currentOrder = updatedData;
        }
        
        state.operationLoading = false;
      })
      .addCase(updateOrderThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.operationLoading = false;
      })
      
      // Delete order - specifically for UpdateOrderPopup
      .addCase(deleteOrderThunk.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(deleteOrderThunk.fulfilled, (state, action) => {
        const deletedId = action.payload;
        
        // Remove from list
        state.list = state.list.filter((order) => order.id !== deletedId);
        
        // Clear current order if it was deleted
        if (state.currentOrder?.id === deletedId) {
          state.currentOrder = null;
        }
        
        state.operationLoading = false;
      })
      .addCase(deleteOrderThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.operationLoading = false;
      })
      
      // Add order to PostSales - for new orders in UpdateOrderPopup
      .addCase(addOrderToPostSalesThunk.pending, (state) => {
        state.operationLoading = true;
        state.error = null;
      })
      .addCase(addOrderToPostSalesThunk.fulfilled, (state, action) => {
        const newOrder = action.payload;
        
        // Add to list if it's a completely new order
        if (newOrder && !state.list.find(o => o.id === newOrder.id)) {
          state.list.unshift(newOrder);
        }
        
        state.operationLoading = false;
      })
      .addCase(addOrderToPostSalesThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.operationLoading = false;
      })
      
      // Update order status
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const { orderId, status } = action.payload;
        const order = state.list.find((o) => o.id === orderId);
        if (order) {
          order.status = status;
        }
        if (state.currentOrder?.id === orderId) {
          state.currentOrder.status = status;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update order step status
      .addCase(updateOrderStepStatusThunk.fulfilled, (state, action) => {
        const { orderStepId, status } = action.payload;
        
        // Update in list
        for (const order of state.list) {
          const step = order.steps?.find((s) => s.id === orderStepId);
          if (step) {
            step.status = status;
            // Check if all steps completed
            const allCompleted = order.steps.every((s) => s.status === "COMPLETED");
            order.status = allCompleted ? "COMPLETED" : "IN_PROGRESS";
            break;
          }
        }
        
        // Update current order if it matches
        if (state.currentOrder) {
          const step = state.currentOrder.steps?.find((s) => s.id === orderStepId);
          if (step) {
            step.status = status;
            const allCompleted = state.currentOrder.steps.every((s) => s.status === "COMPLETED");
            state.currentOrder.status = allCompleted ? "COMPLETED" : "IN_PROGRESS";
          }
        }
      })
      .addCase(updateOrderStepStatusThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentOrder, setOperationLoading } = orderSlice.actions;
export default orderSlice.reducer;