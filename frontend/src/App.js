import { Routes, Route } from 'react-router-dom';
import UnprotectedPage from './pages/UnprotectedPage';
import ProtectedPage from './pages/ProtectedPage';
import AdminPage from './pages/AdminPage';
import PersonalPage from './pages/PersonalPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Users from './pages/Users';
import Drinks from './pages/Drinks';
import Overall from './pages/Overall';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <Routes>
        <Route path="login" element={ <UnprotectedPage element={ <Login /> } /> } />
        <Route path="signup" element={ <UnprotectedPage element={ <Signup /> } /> } />
        <Route path="/" element={ <ProtectedPage element={ <Home /> } /> } />
        <Route path="dashboard/:userId" element={ <PersonalPage element={ <Dashboard /> } /> } />
        <Route path="users" element={ <AdminPage element={ <Users /> } /> } />
        <Route path="drinks" element={ <AdminPage element={ <Drinks /> } /> } />
        <Route path="overall" element={ <AdminPage element={ <Overall /> } /> } />
        <Route path="*" element={ <NotFound /> }/>
      </Routes>
    </div>
  );
}

export default App;
