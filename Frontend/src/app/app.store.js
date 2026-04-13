import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../features/auth/state/auth.slice'
import themeReducer  from '../features/theme/state/theme.slice'

export const store = configureStore({
    reducer:{
        auth:authReducer,
        theme:themeReducer   ,
    }
})