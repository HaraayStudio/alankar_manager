// // store/slices/quotationSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   createQuotation,
//   updateQuotationStatus,
//   updateQuotation,
// } from "../../api/quotationApi";

// // Thunks
// export const addQuotation = createAsyncThunk(
//   "quotations/add",
//   async ({ presalesSrNumber, quotationObj, token }) => {
//     const response = await createQuotation(presalesSrNumber, quotationObj, token);
//     return response.data.data;
//   }
// );

// export const updateQuotationStatusThunk = createAsyncThunk(
//   "quotations/updateStatus",
//   async ({ quotationNumber, isAccepted, token }) => {
//     await updateQuotationStatus(quotationNumber, isAccepted, token);
//     return { quotationNumber, isAccepted };
//   }
// );

// export const updateQuotationThunk = createAsyncThunk(
//   "quotations/update",
//   async ({ quotationObj, quotationNumber, token }) => {
//     const res = await updateQuotation(quotationObj, quotationNumber, token);
//     return res.data.data;
//   }
// );

// const quotationSlice = createSlice({
//   name: "quotations",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addQuotation.fulfilled, (state, action) => {
//         if (action.payload) state.list.unshift(action.payload);
//       })
//       .addCase(updateQuotationStatusThunk.fulfilled, (state, action) => {
//         state.list = state.list.map(q =>
//           q.quotationNumber === action.payload.quotationNumber
//             ? { ...q, isAccepted: action.payload.isAccepted }
//             : q
//         );
//       })
//       .addCase(updateQuotationThunk.fulfilled, (state, action) => {
//         state.list = state.list.map(q =>
//           q.quotationNumber === action.payload.quotationNumber
//             ? action.payload
//             : q
//         );
//       });
//   },
// });

// export default quotationSlice.reducer;



// src/store/slices/quotationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createQuotation,
  updateQuotationStatus,
  updateQuotation,
} from "../../api/quotationApi";

export const addQuotation = createAsyncThunk(
  "quotations/add",
  async ({ presalesSrNumber, quotationObj }, { rejectWithValue }) => {
    try {
      const response = await createQuotation(presalesSrNumber, quotationObj);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add quotation");
    }
  }
);

export const updateQuotationStatusThunk = createAsyncThunk(
  "quotations/updateStatus",
  async ({ quotationNumber, isAccepted }, { rejectWithValue }) => {
    try {
      const response = await updateQuotationStatus(quotationNumber, isAccepted);
      return { quotationNumber, isAccepted, data: response.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update quotation status");
    }
  }
);

export const updateQuotationThunk = createAsyncThunk(
  "quotations/update",
  async ({ quotationObj, quotationNumber }, { rejectWithValue }) => {
    try {
      const response = await updateQuotation(quotationObj, quotationNumber);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update quotation");
    }
  }
);

const quotationSlice = createSlice({
  name: "quotations",
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
      // Add quotation
      .addCase(addQuotation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addQuotation.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
        }
        state.loading = false;
      })
      .addCase(addQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update quotation status
      .addCase(updateQuotationStatusThunk.fulfilled, (state, action) => {
        const { quotationNumber, isAccepted } = action.payload;
        const quotation = state.list.find((q) => q.quotationNumber === quotationNumber);
        if (quotation) {
          quotation.isAccepted = isAccepted;
          quotation.status = isAccepted ? 'ACCEPTED' : 'REJECTED';
        }
      })
      .addCase(updateQuotationStatusThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update quotation
      .addCase(updateQuotationThunk.fulfilled, (state, action) => {
        const updatedQuotation = action.payload;
        if (updatedQuotation && updatedQuotation.quotationNumber) {
          const idx = state.list.findIndex((q) => q.quotationNumber === updatedQuotation.quotationNumber);
          if (idx !== -1) {
            state.list[idx] = updatedQuotation;
          }
        }
      })
      .addCase(updateQuotationThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = quotationSlice.actions;
export default quotationSlice.reducer;