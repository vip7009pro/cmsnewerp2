import { configureStore } from "@reduxjs/toolkit";
import glbReducer from "./slices/globalSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import notificationsReducer from "./slices/notificationsSlice";
import tabsReducer from "./slices/tabsSlice";
import chithiReducer from "./slices/chithiSlice";
import socketReducer from "./slices/socketSlice";
import workflowReducer from "./slices/workflowSlice";

export const store = configureStore({
  reducer: {
    totalSlice: glbReducer,
    auth: authReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
    tabs: tabsReducer,
    chithi: chithiReducer,
    socket: socketReducer,
    workflowSlice: workflowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
