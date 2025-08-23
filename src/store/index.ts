// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import orderReducer from "./slices/orderSlice";
// import clientReducer from "./slices/clientSlice";
// import employeeReducer from "./slices/employeeSlice";
// import presaleReducer from "./slices/presaleSlice";
// import postsaleReducer from "./slices/postsaleSlice";
// import quotationReducer from "./slices/quotationSlice";
// import invoiceReducer from "./slices/invoiceSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     orders: orderReducer,
//     clients: clientReducer,
//     employees: employeeReducer,
//     presales: presaleReducer,
//     postsales: postsaleReducer,
//     quotations: quotationReducer,
//     invoices: invoiceReducer,
//   },
// });

// export default store;

// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import orderReducer from "./slices/orderSlice";
import clientReducer from "./slices/clientSlice";
import employeeReducer from "./slices/employeeSlice";
import presaleReducer from "./slices/presaleSlice";
import postsaleReducer from "./slices/postsaleSlice";
import quotationReducer from "./slices/quotationSlice";
import invoiceReducer from "./slices/invoiceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    clients: clientReducer,
    employees: employeeReducer,
    presales: presaleReducer,
    postsales: postsaleReducer,
    quotations: quotationReducer,
    invoices: invoiceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ["persist/PERSIST"] },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
