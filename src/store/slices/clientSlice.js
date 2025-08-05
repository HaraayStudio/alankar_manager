// store/slices/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllClients, createClient , updateClient } from "../../api/clientsApi";

// Thunks
export const fetchClients = createAsyncThunk(
  "clients/fetchAll",
  async (token) => {
    const response = await getAllClients(token);
    return response.data.data;
  }
);

export const addClient = createAsyncThunk(
  "clients/add",
  async ({ clientData, token }) => {
    const response = await createClient(clientData, token);
    return response.data.data;
  }
);
export const updateClientThunk = createAsyncThunk(
  "clients/update",
  async ({ id, clientINEPAGPDTO, token }) => {
    const response = await updateClient(id, clientINEPAGPDTO, token);
    return response.data.data; // Assuming your API returns updated client here
  }
);

export const fetchClient = createAsyncThunk(
  "clients/fetchById",
  async ({id,token}) => {
    const response = await getClientById(id ,token);
    return response.data.data;
  }
);

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.list = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchClients.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to load clients";
      })
      .addCase(addClient.fulfilled, (state, action) => {
        if (action.payload) state.list.unshift(action.payload);
      }).addCase(updateClientThunk.fulfilled, (state, action) => {
  const updatedClient = action.payload;
  if (updatedClient && updatedClient.id) {
    // Replace the client in list
    const idx = state.list.findIndex((c) => c.id === updatedClient.id);
    if (idx !== -1) state.list[idx] = updatedClient;
  }
})
;
  },
});

export default clientSlice.reducer;
