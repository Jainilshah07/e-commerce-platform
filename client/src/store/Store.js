import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import productReducer from './productSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
  },
});

// 🔁 Restore previous login
const savedAuth = localStorage.getItem('auth');
if (savedAuth) {
  const { user, token } = JSON.parse(savedAuth);
  store.dispatch({ type: 'user/restoreSession', payload: { user, token } });
}

export default store;
