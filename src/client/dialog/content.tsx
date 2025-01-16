import { useState } from 'react';
import Sidebar from "./components/side-bar"
import Home from "./pages/home";
import SlideEditor from "./pages/slide-editor";
import History from "./pages/history";
// import Account from './pages/account';
import HelpCenter from './pages/help-center';
// import AccountContainer from './pages/account/container';
import Account from './pages/account';

const Content = () => {
    const [currentPage, setCurrentPage] = useState('home');
    console.log(currentPage);
    function handleLogout() {
        console.log('Logout');
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home />;
            case 'editor':
                return <SlideEditor />;
            case 'history':
                return <History />;
            case 'account':
                return( 
                <Account
                    userEmail="rushpham2002@gmail.com"
                    userName="Pham Minh Vu"
                    onLogout={handleLogout}
                />
        );
            case 'help':
                return <HelpCenter />;
            default:
                return <Home />;
        }
    };

    return(
        <div className="flex w-full h-screen">        
            <div className="flex-shrink-0">
                <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
            </div>
            <div className="flex-1 overflow-y-auto">
                {renderPage()}
            </div>
        </div>
    )
}

export default Content;