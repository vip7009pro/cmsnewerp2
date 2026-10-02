import { configureStore } from "@reduxjs/toolkit";
import glbReducer from "./slices/globalSlice";
import workflowReducer from "./slices/workflowSlice";
import mailReducer from "./slices/mailSlice";

export const store = configureStore({
  reducer: {
    totalSlice: glbReducer,
    workflowSlice: workflowReducer,
    mailSlice: mailReducer,
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
