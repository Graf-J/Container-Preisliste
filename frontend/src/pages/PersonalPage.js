import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { set } from '../redux/user';
import { Navigate, useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const PersonalPage = ({ element }) => {
    const { user } = useSelector(state => state.user);

    const params = useParams();
    
    const dispatch = useDispatch();

    const userHasPermission = () => {
        if (user) { 
            const decodedToken = jwt_decode(user.jwt);
            if (decodedToken.id === parseInt(params.userId)) {
                return true;
            }
        }
        else if (document.cookie) {
            const jwt = document.cookie.split('=')[1]
            dispatch(set({ name: null, money: null, jwt: jwt }));
            const decodedToken = jwt_decode(jwt);
            if (decodedToken.id === parseInt(params.userId)) {
                return true;
            }
        }
        return false;
    }

    return (
        <>
            { userHasPermission() ? element : <Navigate to='../../' /> }
        </>
    )
}

export default PersonalPage
