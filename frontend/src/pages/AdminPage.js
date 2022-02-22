import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { set } from '../redux/user';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const ProtectedPage = ({ element }) => {
    const { user } = useSelector(state => state.user);

    const dispatch = useDispatch();

    const isAdmin = () => {
        if (user) {
            const decodedToken = jwt_decode(user.jwt);
            if (decodedToken.role === 'admin') {
                return true;
            }
        }
        else if (document.cookie) {
            const jwt = document.cookie.split('=')[1];
            dispatch(set({ name: null, money: null, jwt: jwt }));
            const decodedToken = jwt_decode(jwt);
            if (decodedToken.role === 'admin') {
                return true;
            }
        }
        return false;
    }

    return (
        <>
            { isAdmin() ? element : <Navigate to='../' /> }
        </>
    )
}

export default ProtectedPage