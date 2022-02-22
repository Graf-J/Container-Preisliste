import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { set } from '../redux/user';
import { Navigate } from 'react-router-dom';

const ProtectedPage = ({ element }) => {
    const { user } = useSelector(state => state.user);
    
    const dispatch = useDispatch();

    const userExists = () => {
        if (user) {
            return true;
        }
        else if (document.cookie) {
            dispatch(set({ name: null, money: null, jwt: document.cookie.split('=')[1] }));
            return true;
        }
        return false;
    }

    return (
        <>
            { userExists() ? element : <Navigate to='login' /> }
        </>
    )
}

export default ProtectedPage
