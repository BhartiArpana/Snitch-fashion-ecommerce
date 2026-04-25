import {createBrowserRouter} from 'react-router-dom'
import Register from '../features/auth/pages/Register'
import Login from '../features/auth/pages/Login'
import CreateProduct from '../features/product/pages/CreateProduct'
import Dashboard from '../features/product/pages/Dashboard'
import Protected from '../features/auth/components/Protected'

export const routes = createBrowserRouter([
    {
        path:'/',
        element:<h1>Hello World</h1>
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