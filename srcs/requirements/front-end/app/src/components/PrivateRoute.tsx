import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import API from "../api/api";

export default function PrivateRoute ({children} : any) {

    const [logged, setLogged] = React.useState(true);

    useLayoutEffect(() => {
        API.checkAuth(
            () => {
                setLogged(true);
            },
            () => {
                setLogged(false);
            }   
        );
    }, []);

    return logged ? children : <Navigate to={'/signin'}></Navigate>;

}; 