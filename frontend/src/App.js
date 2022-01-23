import { Routes, Route } from 'react-router-dom';
import UnprotectedPage from './pages/UnprotectedPage';
import ProtectedPage from './pages/ProtectedPage';
import AdminPage from './pages/AdminPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Users from './pages/Users';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={ <ProtectedPage element={ <Home /> } /> } />
        <Route path="login" element={ <UnprotectedPage element={ <Login /> } /> } />
        <Route path="signup" element={ <UnprotectedPage element={ <Signup /> } /> } />
        <Route path="users" element={ <AdminPage element={ <Users /> } /> } />
      </Routes>
    </div>
  );
}

export default App;
