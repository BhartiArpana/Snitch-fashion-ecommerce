import { createBrowserRouter } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import CreateProduct from "../features/products/pages/CreateProduct";
import SellerProducts from '../features/products/pages/SellerProducts'
import DashboardOutlet from "../features/products/pages/DashbaordOutlet";
import Protected from "../features/auth/components/Protected";
import Home from "../features/products/pages/Home";
import LandingPage from "../features/products/pages/LandingPage";
import CardDetails from "../features/products/components/CardDetails";
import SellerProductDetails from "../features/products/components/SellerProductDetails";
import AddToCart from "../features/cart/pages/AddToCart";
import SearchResult from "../features/products/pages/SearchResult";

export const routes = createBrowserRouter([
    {
        path:'/',
        element:<Home/>,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            {
                path:'/products/:id',
                element:<CardDetails />
            },
            {
                path:'/cart',
                element:<AddToCart />
            },
            {
                path:'/search',
                element:<SearchResult />
            }
        ]
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
        element:<Protected role='seller'>
                  <DashboardOutlet />
                </Protected>,
        children:[
            {
                 path:'create-product',
                 element:<CreateProduct />
            },
            {
                path:'dashboard',
                element:<h1>Dashboard</h1>
            },
            {
                path:'products',
                element:<SellerProducts/>
            },
            {
                path:'products/:id',
                element:<SellerProductDetails />
            }
        ]
    }

])