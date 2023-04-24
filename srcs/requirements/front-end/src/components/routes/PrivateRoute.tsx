import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API from "../../network/api";
import { Loading } from './Loading';
import { UserContext } from '../../contexts/User.context';

export default function PrivateRoute ({children} : any) {

    const [logged, setLogged] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const {me, setMe}: any = React.useContext(UserContext);

    useLayoutEffect(() => {
        
        API.checkAuth(
            (u: any) => {
                setMe(u);
                setLogged(true);
            },
            () => {
                setIsLoading(false);
                setMe(null);
            }
        );
    }, []);

    return (
        (logged ? React.cloneElement(children, {me}) : (isLoading ? <Loading/> : <Navigate to={'/authentification'}></Navigate>))
    );

};