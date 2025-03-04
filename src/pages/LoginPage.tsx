import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../auth';

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
	);
};

export default LoginPage;
