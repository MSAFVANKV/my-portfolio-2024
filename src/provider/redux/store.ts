// store/index.ts
import { configureStore } from "@reduxjs/toolkit";
// import userReducer from './slices/AuthAlice/RegisterUserSlice';
import googleSheetReducer from "./slices/googleSheetSlice";

export const store = configureStore({
  reducer: {
    googleSheet: googleSheetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
