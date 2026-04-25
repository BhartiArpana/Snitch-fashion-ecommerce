import { RouterProvider } from 'react-router-dom'
import { routes } from './app.routes'
import {useSelector} from 'react-redux'
import './App.css'
import { useEffect } from 'react';
import ThemeButton from '../features/theme/pages/ThemeButton';
import { useAuth } from '../features/auth/hook/useAuth';

function App() {
  const {handleGetMe} = useAuth()
  const theme = useSelector((state) => state.theme.theme);
  const user = useSelector(state => state.auth.user)
  // console.log(user);
  
  useEffect(()=>{
    handleGetMe()
  },[])

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
  <>

    <RouterProvider router={routes} />
  </>
  )
}

export default App
