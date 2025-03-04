import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth';
import WeatherPage from './pages/WeatherPage';
import LoginPage from './pages/LoginPage';
import { CssBaseline } from '@mui/material';
// import ProtectedRoute from "./auth";
// import './styles.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuth } = useAuth();
	return isAuth ? <>{children}</> : <Navigate to='/login' />;
};

const App: React.FC = () => {
	return (
		<AuthProvider>
			<CssBaseline />
			<Router>
				<Routes>
					<Route path='/login' element={<LoginPage />} />
					<Route
						path='/weather'
						element={
							<ProtectedRoute>
								<WeatherPage />
							</ProtectedRoute>
						}
					/>
					<Route path='*' element={<Navigate to='/login' />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
};

export default App;
