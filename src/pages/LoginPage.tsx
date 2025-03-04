import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../auth';
// import { AuthProvider, useAuth } from "./auth/AuthContext";
// import WeatherPage from "./pages/WeatherPage";
// import ProtectedRoute from "./auth/ProtectedRoute";
// import './styles.css';

const LoginPage: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<Error | null>(null);
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleLogin = () => {
		if (username === 'user' && password === 'password') {
			login();
			navigate('/weather');
		} else {
			setError(new Error('Неверные учетные данные'));
		}
	};

	return (
		<Container maxWidth='xs'>
			{error && <Alert severity='error'>{error.message}</Alert>}
			<Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Typography variant='h5'>Вход</Typography>
				<TextField
					fullWidth
					margin='normal'
					label='Логин'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<TextField
					fullWidth
					margin='normal'
					label='Пароль'
					type='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<Button fullWidth variant='contained' sx={{ mt: 2 }} onClick={handleLogin}>
					Войти
				</Button>
			</Box>
		</Container>
		// <div className="login-container">
		//   <h2>Вход</h2>
		//   <input type="text" placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} />
		//   <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
		//   <button onClick={handleLogin}>Войти</button>
		// </div>
	);
};

export default LoginPage;
