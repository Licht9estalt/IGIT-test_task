import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import {
	LineChart,
	Line,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	LabelList,
	Area,
	ComposedChart
} from 'recharts';
import { useAuth } from '../auth';

const calculateMovingAverage = (data: number[], windowSize: number) => {
	return data
		.map((_, idx, arr) => {
			if (idx < windowSize - 1) return null;
			const avg = arr.slice(idx - windowSize + 1, idx + 1).reduce((sum, val) => sum + val, 0) / windowSize;
			return avg;
		})
		.filter((val) => val !== null) as number[];
};

type WeatherDataType = {
	temp: number[];
	humidity: number[];
	time: string[];
};

const WeatherPage: React.FC = () => {
	const { logout } = useAuth();
	const [weatherData, setWeatherData] = useState<WeatherDataType>({
		temp: [],
		humidity: [],
		time: []
	});
	const [isLoading, setIsLoading] = useState(true);
	const [chartType, setChartType] = useState('line');
	const [windowSize, setWindowSize] = useState(3);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		fetch(
			`https://api.openweathermap.org/data/2.5/forecast?lat=55.75&lon=37.61&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_TOKEN}`
		)
			.then((response) => response.json())
			.then((data) => {
				const temp: number[] = data.list.map((entry: any) => Math.round(entry.main.temp));
				const humidity: number[] = data.list.map((entry: any) => entry.main.humidity);
				const time: string[] = data.list.map((entry: any) => new Date(entry.dt_txt));
				setWeatherData({ temp, humidity, time });
				setError(null);
			})
			.catch((err) => setError(err))
			.finally(() => setIsLoading(false));
	}, []);

	const movingAverage = calculateMovingAverage(weatherData.temp, windowSize);
	const chartData = weatherData.time.slice(windowSize - 1).map((t, i) => ({
		time: t,
		temp: weatherData.temp[i + windowSize - 1],
		humidity: weatherData.humidity[i + windowSize - 1],
		movingAvg: movingAverage[i].toFixed(2)
	}));

	return (
		<Container>
			<Box display='flex' justifyContent='space-between' mt={3}>
				<Typography variant='h5'>Погода в Москве</Typography>
				<Button variant='outlined' onClick={logout}>
					Выйти
				</Button>
			</Box>
			<FormControl style={{ width: '50%', paddingRight: 10 }} sx={{ mt: 2 }}>
				<InputLabel>Тип графика</InputLabel>
				<Select value={chartType} onChange={(e) => setChartType(e.target.value)}>
					<MenuItem value='line'>Линейный</MenuItem>
					<MenuItem value='bar'>Гистограмма</MenuItem>
				</Select>
			</FormControl>
			{chartType === 'line' && (
				<FormControl style={{ width: '50%', paddingLeft: 10 }} sx={{ mt: 2 }}>
					<InputLabel>Окно скользящей средней</InputLabel>
					<Select value={windowSize} onChange={(e) => setWindowSize(Number(e.target.value))}>
						{[3, 5, 7, 10].map((size) => (
							<MenuItem key={size} value={size}>
								{size}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			)}
			{error && <Alert severity='error'>{error.message}</Alert>}
			{isLoading ? (
				<Typography sx={{ mt: 3 }}>Загрузка данных...</Typography>
			) : (
				<ResponsiveContainer width='100%' height={400}>
					{chartType === 'line' ? (
						<LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
							<XAxis
								dataKey='time'
								tick={{ fontSize: 10 }}
								tickFormatter={(val) => new Date(val).toLocaleDateString()}
							/>
							<YAxis />
							<Tooltip
								labelFormatter={(label) => new Date(label).toLocaleString()}
								formatter={(val) => `${Math.round(Number(val))}°C`}
							/>
							<CartesianGrid strokeDasharray='3 3' />
							<Line type='monotone' dataKey='temp' stroke='#8884d8' name='Температура' />
							{/* <Line type='monotone' dataKey='humidity' stroke='#82ca9d' name='Влажность' /> */}

							<Line
								type='monotone'
								dataKey='movingAvg'
								stroke='#ff7300'
								name='Скользящая средняя'
								strokeDasharray='5 5'
							/>
						</LineChart>
					) : (
						<ComposedChart
							data={(() => {
								let maxTemp = chartData.slice().sort((objA, objB) => objB.temp - objA.temp)[0].temp;
								return chartData.map(({ temp, ...rest }) => ({ normalizeTemp: (temp / maxTemp) * 100, temp, ...rest }));
							})()}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<XAxis
								dataKey='time'
								tick={{ fontSize: 10 }}
								tickFormatter={(val) => new Date(val).toLocaleDateString()}
							/>
							<YAxis />
							<Tooltip
								labelFormatter={(label) => new Date(label).toLocaleString()}
								formatter={(val, _, item) =>
									`${item.dataKey === 'normalizeTemp' ? item.payload.temp : val}${item.dataKey === 'normalizeTemp' ? '°C' : '%'}`
								}
							/>
							<CartesianGrid strokeDasharray='3 3' />
							<Bar dataKey='normalizeTemp' fill='#8884d8' name='Температура'>
								<LabelList dataKey='temp' fill='black' fontSize={14} position='top' />
							</Bar>
							<Area
								type='monotone'
								dataKey='humidity'
								name='Влажность'
								fill='#469CEB'
								fillOpacity='0.1'
								stroke='#469CEB'
								dot={{ stroke: '#469CEB', strokeWidth: 2 }}
							/>
							{/* <Bar dataKey='humidity' fill='#82ca9d' name='Влажность' /> */}
						</ComposedChart>
					)}
				</ResponsiveContainer>
			)}
		</Container>
	);
};

export default WeatherPage;
