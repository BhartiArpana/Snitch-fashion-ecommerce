import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.scss';
import { routes } from './app.routes';
import { useAuth } from '../features/auth/hook/useAuth';
import { useEffect } from 'react';

function App() {
  const {handleGetMe} = useAuth()
  const themeMode = useSelector((state) => state.theme.mode);
   const user = useSelector(state=>state.auth.user)

  useEffect(()=>{
     handleGetMe()
  },[])
 
  // console.log('user ',user);
  

  return (
    <div className={`app-container theme-${themeMode}`}>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App
