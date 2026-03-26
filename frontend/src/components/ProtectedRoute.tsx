import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = () => {
  const { userInfo } = useContext(AuthContext);
  return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export const AdminRoute = () => {
  const { userInfo } = useContext(AuthContext);
  return userInfo && userInfo.role === 'admin' ? <Outlet /> : <Navigate to="/" />;
};
