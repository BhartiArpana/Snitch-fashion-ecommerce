import {createBrowserRouter} from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/product/pages/CreateProduct'
import Dashboard from '../features/product/pages/Dashboard'
import Protected from '../features/auth/components/Protected'
import Home from '../features/product/pages/Home'

export const routes = createBrowserRouter([
    {
        path:'/',
        element:<Home />
    },
    {
        path:'/register',
        element:<Register />
    },
    {
        path:'/login',
        element:<Login />
    },
    {
        path:'/seller',
        children:[
            {
                path:'/seller/dashboard',
                element:<Protected role='seller'><Dashboard /></Protected>
            },
            {
                path:'/seller/create-product',
                element:<Protected role='seller'><CreateProduct /></Protected>
            }
        ]
        
    }
])