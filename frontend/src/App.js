import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { set } from './redux/user';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProtectedPage from './pages/ProtectedPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {

  const navigator = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    if (document.cookie) {
      dispatch(set({ name: '', money: 0, jwt: document.cookie.split('=')[1] }));
      navigator('../');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={ <ProtectedPage element={ <Home /> } /> } />
        <Route path="login" element={ <Login /> } />
        <Route path="signup" element={ <Signup /> } />
      </Routes>
    </div>
  );
}

export default App;
