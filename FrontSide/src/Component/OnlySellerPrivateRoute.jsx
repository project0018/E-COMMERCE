import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlySellerPrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);

    return currentUser.role=="seller" ? <Outlet /> : <Navigate to='/sign-in'/>
}
