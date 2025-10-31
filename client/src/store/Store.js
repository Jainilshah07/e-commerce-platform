// src/store/index.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import usersReducer from './UserSlice';
import productsReducer from './productSlice';

// Combine reducers
const rootReducer = combineReducers({
  users: usersReducer,
  products: productsReducer,
});

// Configure persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['users'], // only persist login session (products fetched from API anyway)
};

// Wrap root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);
