
import '@/assets/sass/calendify/intro.scss';
import '@/assets/sass/calendify/backend.scss';
import AdminNavBar from '../AdminNavBar';
import { useEffect } from 'react';

function AdminLayout({ children }) {

    useEffect(() => {
        document.querySelector("body").classList.add('fixed-top-navbar', 'top-nav')
    }, []);

    return (
        <>
            <AdminNavBar />
            <div className="wrapper">
                <div className="content-page">
                    {children}
                </div>
            </div>
        </>
    );
}

export default AdminLayout;