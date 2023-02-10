import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getEmitHelpers } from 'typescript';
import API from "../api/api";
import WrapContext from '../contexts/wrap.context';
import { Loading } from './Loading';
import { UserContext } from '../contexts/User.context';

export default function PrivateRoute ({children} : any) {

    const [logged, setLogged] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const {user, setUser}: any = React.useContext(UserContext);

    useLayoutEffect(() => {
        
        API.checkAuth(
            (u: any) => {
                setUser(u);
                setLogged(true);
            },
            () => {
                setUser(null);
                setIsLoading(false);
            }
        );
    }, []);

    return (
        (logged ? React.cloneElement(children, {user}) : (isLoading ? <Loading/> : <Navigate to={'/signin'}></Navigate>))
    );

}; 