import React, { useState } from 'react';
import AuthContext from './AuthContext';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isAuth, setIsAuth] = useState<boolean>(!!localStorage.getItem('weatherViewAuthToken'));

	const login = () => {
		localStorage.setItem('weatherViewAuthToken', import.meta.env.VITE_AUTH_TOKEN);
		setIsAuth(true);
	};

	const logout = () => {
		localStorage.removeItem('weatherViewAuthToken');
		setIsAuth(false);
	};

	return <AuthContext.Provider value={{ isAuth, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
