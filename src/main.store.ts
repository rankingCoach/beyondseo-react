import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { AppReducer, PostReducer } from './App.slice';


const reducers = combineReducers({
  app: AppReducer,
  post: PostReducer
});

const persist = {
  key: 'rankingcoach_persist',
  whitelist: [''],
  storage,
  timeout: 1
};

export const MiddleWareConfig = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActionPaths: ['register', 'rehydrate']
    }
  }); //.concat(logger),

export type RootState = ReturnType<typeof reducers>;
export const Reducer = persistReducer(persist, reducers);
export const MainStore = configureStore({
  reducer: Reducer,
  middleware: MiddleWareConfig,
});
export const MainStorePersistor = persistStore(MainStore);

// Expose the store to the window object for external access
if (typeof window !== "undefined") {
  (window as any).rankingCoachStore = MainStore;
}
