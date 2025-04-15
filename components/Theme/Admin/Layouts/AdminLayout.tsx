import '@/node_modules/remixicon/fonts/remixicon.scss';
import '@/assets/sass/calendify/intro.scss';
import '@/assets/sass/calendify/backend.scss';
import AdminNavBar from '../AdminNavBar';
import { useEffect } from 'react';
import { APP_MODE, APP_SIDEBAR_OPEN, APP_STATE } from '@/library/redux/constants/app-constants';
import { connect } from 'react-redux';

function AdminLayout({ children, app }) {

    function changeMode(mode) {
        switch (mode) {
            case 'dark':
                //     $('[data-mode="toggle"]').find('i.a-right').removeClass('ri-sun-line');
                //     $('[data-mode="toggle"]').find('i.a-left').addClass('ri-moon-clear-line');
                // $('#dark-mode').prop('checked', true).attr('data-active', 'false')
                // $('.darkmode-logo').removeClass('d-none')
                // $('.light-logo').addClass('d-none')
                document.querySelector("body").classList.add('dark');
                break;
            case 'light':
                // $('[data-mode="toggle"]').find('i.a-left').removeClass('ri-moon-clear-line');
                // $('[data-mode="toggle"]').find('i.a-right').addClass('ri-sun-line');
                // $('#dark-mode').prop('checked', false).attr('data-active', 'true');
                // $('.light-logo').removeClass('d-none')
                // $('.darkmode-logo').addClass('d-none')
                document.querySelector("body").classList.remove('dark');
                break;

        }
    }

    useEffect(() => {
        changeMode(app[APP_MODE]);
    }, [app[APP_MODE]]);

    useEffect(() => {
        if (app[APP_SIDEBAR_OPEN]) {
            document.querySelector("body").classList.add('sidebar-main');
        } else {
            document.querySelector("body").classList.remove('sidebar-main');
        }
    }, [app[APP_SIDEBAR_OPEN]]);

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

export default connect(
    state => ({
        app: state[APP_STATE],
    })
)(AdminLayout);