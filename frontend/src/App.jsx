import {Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Home from './Home.jsx';
import Leidos from './Leidos.jsx';
import AuthPage from './AuthPage.jsx';
import {useAuth} from './AuthContext.jsx';

function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace/>;
    }
    return children;
}

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                
                <Route path='/auth' element={<AuthPage />} />
                <Route path='/' element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                } />
                <Route path='/leidos' element={
                    <PrivateRoute>
                        <Leidos />
                    </PrivateRoute>
                } />    
                <Route path='*' element={<Navigate to='/auth' replace />} />
            </Routes>
        </>
    );
}
export default App;
