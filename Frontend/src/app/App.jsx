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
  

  // Sync theme class to <html> so CSS vars cascade correctly from root
  // (Applying theme only on .app-container div can't affect html/body background)
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    } else {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    }
  }, [themeMode]);

  return (
    <div className={`app-container theme-${themeMode}`}>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App
