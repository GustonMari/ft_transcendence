import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API from "../api/api";

export default function PrivateRoute ({children} : any) {

    const [logged, setLogged] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    useLayoutEffect(() => {
        API.checkAuth(
            () => {
                setLogged(true);
            },
            () => {
                setIsLoading(false);
            }   
        );
    }, []);

    return (
        (logged ? children : (isLoading ? 'loading...' : <Navigate to={'/signin'}></Navigate>))
    );

}; 