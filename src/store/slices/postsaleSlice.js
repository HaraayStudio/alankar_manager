// // // store/slices/postsaleSlice.js
// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// // import {
// //   getAllPostSales,
// //   createPostSale,
// //   updatePostSale,
// //   sendnginvoice as sendNgInvoiceApi,
// //   sendinvoice as sendInvoiceApi,
// // } from "../../api/postSale";
// // import { getAllOrders } from "../../api/orderApi";

// // // Thunks
// // export const fetchPostSales = createAsyncThunk(
// //   "postsales/fetchAll",
// //   async (token) => {
// //     const res = await getAllPostSales(token);
// //     return Array.isArray(res.data)
// //       ? res.data
// //       : Array.isArray(res.data.data)
// //         ? res.data.data
// //         : [];
// //   }
// // );

// // export const addPostSale = createAsyncThunk(
// //   "postsales/add",
// //   async ({ postSalesObj, isOldClient, token }) => {
// //     const res = await createPostSale(postSalesObj, isOldClient, token);
// //     return res.data.data;
// //   }
// // );

// // export const updatePostSaleThunk = createAsyncThunk(
// //   "postsales/update",
// //   async ({ postSale, token }) => {
// //     const res = await updatePostSale(postSale, token);
// //     return res.data.data;
// //   }
// // );

// // // ✅ Thunk names are different from imported function names
// // export const sendInvoiceThunk = createAsyncThunk(
// //   "postsales/sendinvoice",
// //   async ({ srNumber, token }) => {
// //     await sendInvoiceApi(srNumber, token);
// //     return srNumber;
// //   }
// // );

// // export const sendNgInvoiceThunk = createAsyncThunk(
// //   "postsales/sendnginvoice",
// //   async ({ srNumber, token }) => {
// //     await sendNgInvoiceApi(srNumber, token);
// //     return srNumber;
// //   }
// // );

// // const postsaleSlice = createSlice({
// //   name: "postsales",
// //   initialState: {
// //     list: [],
// //     loading: false,
// //     error: null,
// //   },
// //   reducers: {},
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchPostSales.pending, (state) => {
// //         state.loading = true;
// //       })
// //       .addCase(fetchPostSales.fulfilled, (state, action) => {
// //         state.list = action.payload || [];
// //         state.loading = false;
// //       })
// //       .addCase(fetchPostSales.rejected, (state) => {
// //         state.loading = false;
// //         state.error = "Failed to load postsales";
// //       })
// //       .addCase(addPostSale.fulfilled, (state, action) => {
// //         if (action.payload) state.list.unshift(action.payload);
// //       })
// //       .addCase(updatePostSaleThunk.fulfilled, (state, action) => {
// //         state.list = state.list.map(ps =>
// //           ps.id === action.payload.id ? action.payload : ps
// //         );
// //       });

// //     // Optional: add loading/error states for sendInvoiceThunk/sendNgInvoiceThunk if needed
// //   },
// // });

// // export default postsaleSlice.reducer;



// // src/store/slices/postsaleSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getAllPostSales,
//   createPostSale,
//   updatePostSale,
//   addOrderInPostSales,
// } from "../../api/postsaleApi";
// import {
//   sendInvoiceMail,
//   sendNGInvoiceMail,
// } from "../../api/invoiceApi";

// export const fetchPostSales = createAsyncThunk(
//   "postsales/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getAllPostSales();
//       console.log(response.data.data);
      
//       return response.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to fetch postsales");
//     }
//   }
// );

// export const addPostSale = createAsyncThunk(
//   "postsales/add",
//   async ({ postSalesObj, isOldClient }, { rejectWithValue }) => {
//     try {
//       const response = await createPostSale(postSalesObj, isOldClient);
//       return response.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to add postsale");
//     }
//   }
// );

// export const updatePostSaleThunk = createAsyncThunk(
//   "postsales/update",
//   async (postSale, { rejectWithValue }) => {
//     try {
//       const response = await updatePostSale(postSale);
//       return response.data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to update postsale");
//     }
//   }
// );

// export const sendInvoiceThunk = createAsyncThunk(
//   "postsales/sendInvoice",
//   async (srNumber, { rejectWithValue }) => {
//     try {
//       await sendInvoiceMail(srNumber);
//       return srNumber;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to send invoice");
//     }
//   }
// );

// export const sendNgInvoiceThunk = createAsyncThunk(
//   "postsales/sendNgInvoice",
//   async (srNumber, { rejectWithValue }) => {
//     try {
//       await sendNGInvoiceMail(srNumber);
//       return srNumber;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to send NG invoice");
//     }
//   }
// );

// export const addOrderInPostSalesThunk = createAsyncThunk(
//   "postsales/addOrder",
//   async ({ srNumber, order, images }, { rejectWithValue }) => {
//     try {
//       const response = await addOrderInPostSales(srNumber, order, images);
//       return { srNumber, order: response.data };
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message || "Failed to add order");
//     }
//   }
// );

// const postsaleSlice = createSlice({
//   name: "postsales",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch postsales
//       .addCase(fetchPostSales.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchPostSales.fulfilled, (state, action) => {
//         state.list = action.payload || [];
//         state.loading = false;
//       })
//       .addCase(fetchPostSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
      
//       // Add postsale
//       .addCase(addPostSale.fulfilled, (state, action) => {
//         if (action.payload) {
//           state.list.unshift(action.payload);
//         }
//       })
//       .addCase(addPostSale.rejected, (state, action) => {
//         state.error = action.payload;
//       })
      
//       // Update postsale
//       .addCase(updatePostSaleThunk.fulfilled, (state, action) => {
//         const updatedPostSale = action.payload;
//         if (updatedPostSale && updatedPostSale.srNumber) {
//           const idx = state.list.findIndex((p) => p.srNumber === updatedPostSale.srNumber);
//           if (idx !== -1) {
//             state.list[idx] = updatedPostSale;
//           }
//         }
//       })
//       .addCase(updatePostSaleThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       })
      
//       // Send invoice
//       .addCase(sendInvoiceThunk.fulfilled, (state, action) => {
//         const srNumber = action.payload;
//         const postsale = state.list.find((p) => p.srNumber === srNumber);
//         if (postsale) {
//           postsale.invoiceSent = true;
//         }
//       })
//       .addCase(sendInvoiceThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       })
      
//       // Send NG invoice
//       .addCase(sendNgInvoiceThunk.fulfilled, (state, action) => {
//         const srNumber = action.payload;
//         const postsale = state.list.find((p) => p.srNumber === srNumber);
//         if (postsale) {
//           postsale.ngInvoiceSent = true;
//         }
//       })
//       .addCase(sendNgInvoiceThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       })
      
//       // Add order in postsales
//       .addCase(addOrderInPostSalesThunk.fulfilled, (state, action) => {
//         const { srNumber, order } = action.payload;
//         const postsale = state.list.find((p) => p.srNumber === srNumber);
//         if (postsale) {
//           postsale.orders = postsale.orders ? [...postsale.orders, order] : [order];
//         }
//       })
//       .addCase(addOrderInPostSalesThunk.rejected, (state, action) => {
//         state.error = action.payload;
//       });
//   },
// });

// export const { clearError } = postsaleSlice.actions;
// export default postsaleSlice.reducer;
// src/store/slices/postsaleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllPostSales,
  createPostSale,
  updatePostSale,
  addOrderInPostSales,
} from "../../api/postsaleApi";
import {
  sendInvoiceMail,
  sendNGInvoiceMail,
} from "../../api/invoiceApi";

// Fetch all PostSales
export const fetchPostSales = createAsyncThunk(
  "postsales/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("📡 Fetching PostSales...");
      const response = await getAllPostSales();
      console.log("✅ PostSales fetched:", response.data);
      return response.data.data || response.data;
    } catch (err) {
      console.error("❌ PostSales fetch error:", err);
      return rejectWithValue(err.response?.data?.message || "Failed to fetch postsales");
    }
  }
);

export const addPostSale = createAsyncThunk(
  "postsales/add",
  async ({ postSalesObj, isOldClient }, { rejectWithValue }) => {
    try {
      const response = await createPostSale(postSalesObj, isOldClient);
      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add postsale");
    }
  }
);

export const updatePostSaleThunk = createAsyncThunk(
  "postsales/update",
  async (postSale, { rejectWithValue }) => {
    try {
      const response = await updatePostSale(postSale);
      return response.data.data || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update postsale");
    }
  }
);

export const sendInvoiceThunk = createAsyncThunk(
  "postsales/sendInvoice",
  async (srNumber, { rejectWithValue }) => {
    try {
      await sendInvoiceMail(srNumber);
      return srNumber;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send invoice");
    }
  }
);

export const sendNgInvoiceThunk = createAsyncThunk(
  "postsales/sendNgInvoice",
  async (srNumber, { rejectWithValue }) => {
    try {
      await sendNGInvoiceMail(srNumber);
      return srNumber;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send NG invoice");
    }
  }
);

export const addOrderInPostSalesThunk = createAsyncThunk(
  "postsales/addOrder",
  async ({ srNumber, order, images }, { rejectWithValue }) => {
    try {
      const response = await addOrderInPostSales(srNumber, order, images);
      return { srNumber, order: response.data || response };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add order");
    }
  }
);

const postsaleSlice = createSlice({
  name: "postsales",
  initialState: {
    list: [],
    currentPostSale: null,
    loading: false,
    operationLoading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPostSale: (state, action) => {
      state.currentPostSale = action.payload;
    },
    clearCurrentPostSale: (state) => {
      state.currentPostSale = null;
    },
    // Manually update order in PostSale (for real-time sync)
    updateOrderInPostSale: (state, action) => {
      const { srNumber, orderId, updatedOrder } = action.payload;
      const postSale = state.list.find(p => p.srNumber === srNumber);
      if (postSale && postSale.orders) {
        const orderIndex = postSale.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          postSale.orders[orderIndex] = updatedOrder;
        }
      }
      if (state.currentPostSale?.srNumber === srNumber && state.currentPostSale.orders) {
        const orderIndex = state.currentPostSale.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          state.currentPostSale.orders[orderIndex] = updatedOrder;
        }
      }
      state.lastUpdated = new Date().toISOString();
    },
    // Add order to PostSale (for real-time sync)
    addOrderToPostSale: (state, action) => {
      const { srNumber, newOrder } = action.payload;
      const postSale = state.list.find(p => p.srNumber === srNumber);
      if (postSale) {
        postSale.orders = postSale.orders ? [...postSale.orders, newOrder] : [newOrder];
      }
      if (state.currentPostSale?.srNumber === srNumber) {
        state.currentPostSale.orders = state.currentPostSale.orders ? 
          [...state.currentPostSale.orders, newOrder] : [newOrder];
      }
      state.lastUpdated = new Date().toISOString();
    },
    // Remove order from PostSale (for real-time sync)
    removeOrderFromPostSale: (state, action) => {
      const { srNumber, orderId } = action.payload;
      const postSale = state.list.find(p => p.srNumber === srNumber);
      if (postSale && postSale.orders) {
        postSale.orders = postSale.orders.filter(o => o.id !== orderId);
      }
      if (state.currentPostSale?.srNumber === srNumber && state.currentPostSale.orders) {
        state.currentPostSale.orders = state.currentPostSale.orders.filter(o => o.id !== orderId);
      }
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch postsales
      .addCase(fetchPostSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostSales.fulfilled, (state, action) => {
        state.list = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPostSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add postsale
      .addCase(addPostSale.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addPostSale.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update postsale
      .addCase(updatePostSaleThunk.fulfilled, (state, action) => {
        const updatedPostSale = action.payload;
        if (updatedPostSale && updatedPostSale.srNumber) {
          const idx = state.list.findIndex((p) => p.srNumber === updatedPostSale.srNumber);
          if (idx !== -1) {
            state.list[idx] = updatedPostSale;
          }
          if (state.currentPostSale?.srNumber === updatedPostSale.srNumber) {
            state.currentPostSale = updatedPostSale;
          }
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePostSaleThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Send invoice
      .addCase(sendInvoiceThunk.fulfilled, (state, action) => {
        const srNumber = action.payload;
        const postsale = state.list.find((p) => p.srNumber === srNumber);
        if (postsale) {
          postsale.invoiceSent = true;
        }
      })
      .addCase(sendInvoiceThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Send NG invoice
      .addCase(sendNgInvoiceThunk.fulfilled, (state, action) => {
        const srNumber = action.payload;
        const postsale = state.list.find((p) => p.srNumber === srNumber);
        if (postsale) {
          postsale.ngInvoiceSent = true;
        }
      })
      .addCase(sendNgInvoiceThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add order in postsales
      .addCase(addOrderInPostSalesThunk.pending, (state) => {
        state.operationLoading = true;
      })
      .addCase(addOrderInPostSalesThunk.fulfilled, (state, action) => {
        const { srNumber, order } = action.payload;
        const postsale = state.list.find((p) => p.srNumber === srNumber);
        if (postsale) {
          postsale.orders = postsale.orders ? [...postsale.orders, order] : [order];
        }
        if (state.currentPostSale?.srNumber === srNumber) {
          state.currentPostSale.orders = state.currentPostSale.orders ? 
            [...state.currentPostSale.orders, order] : [order];
        }
        state.operationLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(addOrderInPostSalesThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.operationLoading = false;
      });
  },
});

export const { 
  clearError, 
  setCurrentPostSale, 
  clearCurrentPostSale,
  updateOrderInPostSale,
  addOrderToPostSale,
  removeOrderFromPostSale
} = postsaleSlice.actions;

export default postsaleSlice.reducer;