// // store/slices/presaleSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getAllPresales,
//   createPresale,
//   updatePresaleStatus,
//   deletePresale,
// } from "../../api/preSale";

// // Thunks
// export const fetchPresales = createAsyncThunk(
//   "presales/fetchAll",
//   async (token) => {
//     const res = await getAllPresales(token);
//     return res.data?.data || [];
//   }
// );

// export const addPresale = createAsyncThunk(
//   "presales/add",
//   async ({ presale, isOldClient, token }) => {
//     const res = await createPresale(presale, isOldClient, token);
//     return res.data.data;
//   }
// );

// export const updatePresale = createAsyncThunk(
//   "presales/update",
//   async ({ srNumber, status, token }) => {
//     await updatePresaleStatus(srNumber, status, token);
//     return { srNumber, status };
//   }
// );

// export const deletePresaleThunk = createAsyncThunk(
//   "presales/delete",
//   async ({ srNumber, token }) => {
//     await deletePresale(srNumber, token);
//     return srNumber;
//   }
// );

// const presaleSlice = createSlice({
//   name: "presales",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPresales.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchPresales.fulfilled, (state, action) => {
//         state.list = action.payload || [];
//         state.loading = false;
//       })
//       .addCase(fetchPresales.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to load presales";
//       })
//       .addCase(addPresale.fulfilled, (state, action) => {
//         if (action.payload) state.list.unshift(action.payload);
//       })
//       .addCase(updatePresale.fulfilled, (state, action) => {
//         state.list = state.list.map(ps =>
//           ps.srNumber === action.payload.srNumber
//             ? { ...ps, status: action.payload.status }
//             : ps
//         );
//       })
//       .addCase(deletePresaleThunk.fulfilled, (state, action) => {
//         state.list = state.list.filter(ps => ps.srNumber !== action.payload);
//       });
//   },
// });

// export default presaleSlice.reducer;


// src/store/slices/presaleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllPresales,
  createPresale,
  updatePresaleStatus,
  deletePresale,
  addPreSalesOrderInPresales,
} from "../../api/presalesApi";

export const fetchPresales = createAsyncThunk(
  "presales/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllPresales();
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch presales");
    }
  }
);

export const addPresale = createAsyncThunk(
  "presales/add",
  async ({ presale, isOldClient, images }, { rejectWithValue }) => {
    try {
      const response = await createPresale(presale, isOldClient, images);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add presale");
    }
  }
);

export const updatePresale = createAsyncThunk(
  "presales/updateStatus",
  async ({ srNumber, status }, { rejectWithValue }) => {
    try {
      const response = await updatePresaleStatus(srNumber, status);
      return { srNumber, status, data: response.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update presale");
    }
  }
);

export const deletePresaleThunk = createAsyncThunk(
  "presales/delete",
  async (srNumber, { rejectWithValue }) => {
    try {
      await deletePresale(srNumber);
      return srNumber;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete presale");
    }
  }
);

export const addOrderInPresales = createAsyncThunk(
  "presales/addOrder",
  async ({ srNumber, order }, { rejectWithValue }) => {
    try {
      const response = await addPreSalesOrderInPresales(srNumber, order);
      return { srNumber, order: response.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add order");
    }
  }
);

const presaleSlice = createSlice({
  name: "presales",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch presales
      .addCase(fetchPresales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPresales.fulfilled, (state, action) => {
        state.list = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchPresales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add presale
      .addCase(addPresale.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(addPresale.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update presale status
      .addCase(updatePresale.fulfilled, (state, action) => {
        const { srNumber, status } = action.payload;
        const presale = state.list.find((p) => p.srNumber === srNumber);
        if (presale) {
          presale.status = status;
        }
      })
      .addCase(updatePresale.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Delete presale
      .addCase(deletePresaleThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((presale) => presale.srNumber !== action.payload);
      })
      .addCase(deletePresaleThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Add order in presales
      .addCase(addOrderInPresales.fulfilled, (state, action) => {
        const { srNumber, order } = action.payload;
        const presale = state.list.find((p) => p.srNumber === srNumber);
        if (presale) {
          presale.orders = presale.orders ? [...presale.orders, order] : [order];
        }
      })
      .addCase(addOrderInPresales.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = presaleSlice.actions;
export default presaleSlice.reducer;
