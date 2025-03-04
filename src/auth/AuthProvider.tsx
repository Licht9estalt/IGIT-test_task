import React, { useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
// import WeatherPage from "./pages/WeatherPage";
// import './styles.css';
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
