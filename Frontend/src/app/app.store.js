import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/state/auth.state';
import themeReducer from './theme.state';

export const store = configureStore({
    reducer:{
        auth: authReducer,
        theme: themeReducer
    }
});