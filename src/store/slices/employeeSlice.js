// // store/slices/employeeSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   createEmployee,
//   getEmployeeById,
//   updateEmployee,
//   getAllEmployees,
//   deleteEmployee,
// } from "../../api/employeeApi";

// // Thunks
// export const fetchEmployees = createAsyncThunk(
//   "employees/fetchAll",
//   async (token) => {
//     const response = await getAllEmployees(token);
//     return response.data.data;
//   }
// );

// export const addEmployee = createAsyncThunk(
//   "employees/add",
//   async ({ employeeData, token }) => {
//     const response = await createEmployee(employeeData, token);
//     return response.data.data;
//   }
// );

// export const updateEmployeeThunk = createAsyncThunk(
//   'employees/update',
//   async ({ updatedData, token }) => {
//     const id = updatedData.id;
//     const response = await updateEmployee(id, updatedData, token); // ✅ pass the ID
    
//     return response.data.data;
//   }
// );


// export const deleteEmployeeThunk = createAsyncThunk(
//   "employees/delete",
//   async ({ id, token }) => {
//     await deleteEmployee(id, token);
//     return id;
//   }
// );

// const employeeSlice = createSlice({
//   name: "employees",
//   initialState: {
//     list: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchEmployees.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchEmployees.fulfilled, (state, action) => {
//         state.list = action.payload || [];
//         state.loading = false;
//       })
//       .addCase(fetchEmployees.rejected, (state) => {
//         state.loading = false;
//         state.error = "Failed to load employees";
//       })
//       .addCase(addEmployee.fulfilled, (state, action) => {
//         if (action.payload) state.list.unshift(action.payload);
//       })
//       .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
//         state.list = state.list.map(emp =>
//           emp.id === action.payload.id ? action.payload : emp
//         );
//       })
//       .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
//         state.list = state.list.filter(emp => emp.id !== action.payload);
//       });
//   },
// });

// export default employeeSlice.reducer;


// src/store/slices/employeeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../api/employeeApi";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllEmployees();
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch employees");
    }
  }
);

export const fetchEmployee = createAsyncThunk(
  "employees/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getEmployeeById(id);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch employee");
    }
  }
);

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await createEmployee(employeeData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add employee");
    }
  }
);

export const updateEmployeeThunk = createAsyncThunk(
  "employees/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateEmployee(id, updatedData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update employee");
    }
  }
);

export const deleteEmployeeThunk = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteEmployee(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete employee");
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    list: [],
    currentEmployee: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.list = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single employee
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.currentEmployee = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add employee
      .addCase(addEmployee.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Update employee
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        const updatedEmployee = action.payload;
        if (updatedEmployee && updatedEmployee.id) {
          const idx = state.list.findIndex((e) => e.id === updatedEmployee.id);
          if (idx !== -1) {
            state.list[idx] = updatedEmployee;
          }
          if (state.currentEmployee?.id === updatedEmployee.id) {
            state.currentEmployee = updatedEmployee;
          }
        }
      })
      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Delete employee
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.list = state.list.filter((employee) => employee.id !== action.payload);
        if (state.currentEmployee?.id === action.payload) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployeeThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
