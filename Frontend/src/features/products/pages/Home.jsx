

import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import '../style/home.scss';

function Home(){
    return (
        <>
            <Navbar />
            <main className="home-main">
                <Outlet />
            </main>
        </>
    );
}

export default Home;