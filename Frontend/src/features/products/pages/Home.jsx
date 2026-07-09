

import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

function Home(){
    return (
        <>
            <Navbar />
            <main style={{ padding: '2rem 1.5rem', maxWidth: '80rem', margin: '0 auto', width: '100%' }}>
                <Outlet />
            </main>
        </>
    );
}

export default Home;