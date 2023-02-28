import React, { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getEmitHelpers } from 'typescript';
import API from "../api/api";
import WrapContext from '../contexts/wrap.context';
import { Loading } from './Loading';
import { UserContext } from '../contexts/User.context';

export default function PublicRoute ({children} : any) {

    const [logged, setLogged] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    useLayoutEffect(() => {
        
        API.checkAuth(
            (u: any) => {
                setIsLoading(false);
            },
            () => {
                setLogged(true);
            }
        );
    }, []);

    return (
        (logged ? React.cloneElement(children) : (isLoading ? <Loading/> : <Navigate to={'/home'}></Navigate>))
    );

}; 