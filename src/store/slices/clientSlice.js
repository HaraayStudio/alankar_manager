// // store/slices/clientSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   getAllClients,
//   createClient,
//   updateClient,
// } from "../../api/clientsApi";

// // Thunks
// export const fetchClients = createAsyncThunk(
//   "clients/fetchAll",
//   async (token) => {
//     const response = await getAllClients(token);
//     return response.data.data;
//   }
// );

// export const addClient = createAsyncThunk(
//   "clients/add",
//   async ({ clientData, token }) => {
//     const response = await createClient(clientData, token);
//     return response.data.data;
//   }
// );
// export const updateClientThunk = createAsyncThunk(
//   "clients/update",
//   async ({ id, clientINEPAGPDTO, token }) => {
//     const response = await updateClient(id, clientINEPAGPDTO, token);
//     return response.data.data; // Assuming your API returns updated client here
//   }
// );

// export const fetchClient = createAsyncThunk(
//   "clients/fetchById",
//   async ({ id, token }) => {
//     const response = await getClientById(id, token);
//     return response.data.data;
//   }
// );

// const clientSlice = createSlice({
//   name: "clients",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchClients.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchClients.fulfilled, (state, action) => {
//         state.list = action.payload || [];
//         state.loading = false;
//       })
//       .addCase(fetchClients.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to load clients";
//       })
//       .addCase(addClient.fulfilled, (state, action) => {
//         if (action.payload) state.list.unshift(action.payload);
//       })
//       .addCase(updateClientThunk.fulfilled, (state, action) => {
//         const updatedClient = action.payload;
//         if (updatedClient && updatedClient.id) {
//           // Replace the client in list
//           const idx = state.list.findIndex((c) => c.id === updatedClient.id);
//           if (idx !== -1) state.list[idx] = updatedClient;
//         }
//       });
//   },
// });

// export default clientSlice.reducer;


// src/store/slices/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../../api/clientsApi";

export const fetchClients = createAsyncThunk(
  "clients/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllClients();
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch clients");
    }
  }
);

export const fetchClient = createAsyncThunk(
  "clients/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getClientById(id);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch client");
    }
  }
);

export const addClient = createAsyncThunk(
  "clients/add",
  async (clientData, { rejectWithValue }) => {
    try {
      const response = await createClient(clientData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add client");
    }
  }
);

export const updateClientThunk = createAsyncThunk(
  "clients/update",
  async ({ id, clientINEPAGPDTO }, { rejectWithValue }) => {
    try {
      const response = await updateClient(id, clientINEPAGPDTO);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update client");
    }
  }
);

export const deleteClientThunk = createAsyncThunk(
  "clients/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteClient(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete client");
    }
  }
);

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
    currentClient: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.list = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single client
      .addCase(fetchClient.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClient.fulfilled, (state, action) => {
        state.currentClient = action.payload;
        state.loading = false;
      })
      .addCase(fetchClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add client
      .addCase(addClient.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(addClient.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update client
      .addCase(updateClientThunk.fulfilled, (state, action) => {
        const updatedClient = action.payload;
        if (updatedClient && updatedClient.id) {
          const idx = state.list.findIndex((c) => c.id === updatedClient.id);
          if (idx !== -1) {
            state.list[idx] = updatedClient;
          }
          if (state.currentClient?.id === updatedClient.id) {
            state.currentClient = updatedClient;
          }
        }
      })
      .addCase(updateClientThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Delete client
      .addCase(deleteClientThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((client) => client.id !== action.payload);
        if (state.currentClient?.id === action.payload) {
          state.currentClient = null;
        }
      })
      .addCase(deleteClientThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentClient } = clientSlice.actions;
export default clientSlice.reducer;