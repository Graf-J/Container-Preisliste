import { Routes, Route } from 'react-router-dom';
import ProtectedPage from './components/ProtectedPage';
import Home from './components/Home';
import Login from './components/Login';

function App() {
  return (
    <div>
      <header>
        <h1>Welcome to React Router!!!!</h1>
      </header>
      <Routes>
        <Route path="/" element={ <ProtectedPage element={ <Home /> } /> } />
        <Route path="login" element={ <Login /> } />
      </Routes>
    </div>
  );
}

export default App;
