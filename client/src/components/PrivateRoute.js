import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import userDataService from '../services/user.service';

const PrivateRoute = ({ element, requiredRole }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);
    
    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await userDataService.getProfile(); // Mendapatkan profil pengguna
                const { role } = response.data;
                
                if (role === requiredRole) {
                    setIsAuthorized(true); // Izinkan akses jika rolenya sesuai
                } else {
                    setIsAuthorized(false); // Larang akses jika rolenya tidak sesuai
                }
            } catch (error) {
                setIsAuthorized(false); // Jika gagal mendapatkan profil, larang akses
            }
        };
        
        checkAuthorization();
    }, [requiredRole]);
    
    if (isAuthorized === null) {
        return <div>Loading...</div>; // Sambil menunggu pengecekan selesai
    }

    return isAuthorized ? element : <Navigate to="/not-found" />; // Arahkan ke NotFoundPage jika tidak authorized
};

export default PrivateRoute;
