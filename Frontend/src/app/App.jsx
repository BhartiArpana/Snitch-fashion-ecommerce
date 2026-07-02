import { RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.scss';
import { routes } from './app.routes';

function App() {
  const themeMode = useSelector((state) => state.theme.mode);

  return (
    <div className={`app-container theme-${themeMode}`}>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App
