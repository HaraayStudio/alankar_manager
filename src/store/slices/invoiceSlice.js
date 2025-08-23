// src/store/slices/invoiceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllInvoices,
  getAllNGInvoices,
  createInvoice,
  createNGInvoice,
} from "../../api/invoiceApi";

// Fetch all GST invoices
export const fetchInvoices = createAsyncThunk(
  "invoices/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllInvoices();
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch invoices"
      );
    }
  }
);

// Fetch all NON-GST invoices
export const fetchNGInvoices = createAsyncThunk(
  "invoices/fetchAllNG",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllNGInvoices();
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch NG invoices"
      );
    }
  }
);

// Create GST invoice
export const createInvoiceThunk = createAsyncThunk(
  "invoices/create",
  async (postSaleSrNumber, { rejectWithValue }) => {
    try {
      const response = await createInvoice(postSaleSrNumber);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create invoice"
      );
    }
  }
);

// Create NON-GST invoice
export const createNGInvoiceThunk = createAsyncThunk(
  "invoices/createNG",
  async (postSaleSrNumber, { rejectWithValue }) => {
    try {
      const response = await createNGInvoice(postSaleSrNumber);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create NG invoice"
      );
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoices",
  initialState: {
    list: [], // GST invoices
    ngList: [], // NON-GST invoices
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
      // Fetch GST invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.list = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch NON-GST invoices
      .addCase(fetchNGInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNGInvoices.fulfilled, (state, action) => {
        state.ngList = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchNGInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create GST invoice
      .addCase(createInvoiceThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createInvoiceThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
        }
        state.loading = false;
      })
      .addCase(createInvoiceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create NON-GST invoice
      .addCase(createNGInvoiceThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNGInvoiceThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.ngList.unshift(action.payload);
        }
        state.loading = false;
      })
      .addCase(createNGInvoiceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = invoiceSlice.actions;
export default invoiceSlice.reducer;