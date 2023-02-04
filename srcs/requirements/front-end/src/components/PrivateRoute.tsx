import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getEmitHelpers } from 'typescript';
import API from "../api/api";
import { Loading } from './Loading';

export default function PrivateRoute ({children} : any) {

    const [logged, setLogged] = React.useState(false);
    const [user, setUser] = React.useState({} as any);
    const [isLoading, setIsLoading] = React.useState(true);

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