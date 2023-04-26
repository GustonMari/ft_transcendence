import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Loading } from './Loading';
import { UserContext } from '../../contexts/User.context';
import { APP } from '../../network/app';

export default function PrivateRoute ({children} : any) {

    const [logged, setLogged] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const {me, setMe}: any = React.useContext(UserContext);

    useEffect(() => {
        
        APP.get('user/me')
        .then((r) => {
            setMe(r.data);
            setLogged(true);
        }
        ).catch(() => {
            setIsLoading(false);
            setMe(null);
        });

    }, [setMe]);

    return (
        (logged ? React.cloneElement(children, {me}) : (isLoading ? <Loading/> : <Navigate to={'/authentification'}></Navigate>))
    );

};