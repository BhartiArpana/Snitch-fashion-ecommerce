import { RouterProvider } from 'react-router-dom'
import { routes } from './app.routes'
import {useSelector} from 'react-redux'
import './App.css'
import { useEffect } from 'react';
import ThemeButton from '../features/theme/pages/ThemeButton';

function App() {
  const theme = useSelector((state) => state.theme.theme);

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
