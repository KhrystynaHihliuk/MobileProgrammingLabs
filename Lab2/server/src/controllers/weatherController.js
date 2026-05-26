import axios from 'axios';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const normalizeCurrentWeather = (data) => ({
city: data.name,
country: data.sys?.country || '',
description: data.weather?.[0]?.description || '',
icon: data.weather?.[0]?.icon || '',
temperature: data.main?.temp ?? null,
feelsLike: data.main?.feels_like ?? null,
humidity: data.main?.humidity ?? null,
pressure: data.main?.pressure ?? null,
windSpeed: data.wind?.speed ?? null,
});
const normalizeForecast = (data) =>
(data.list || []).slice(0, 8).map((item) => ({
id: String(item.dt),
dateText: item.dt_txt,
temperature: item.main?.temp ?? null,
humidity: item.main?.humidity ?? null,
pressure: item.main?.pressure ?? null,
windSpeed: item.wind?.speed ?? null,
description: item.weather?.[0]?.description || '',
icon: item.weather?.[0]?.icon || '',
}));
export const getCurrentWeather = async (req, res) => {
    try {
        const { city, units = 'metric' } = req.query;
        if (!city) {
        return res.status(400).json({
        success: false,
        message: 'Параметр city є обов’язковим',
    });
    }
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
    params: {
    q: city,
    appid: process.env.OPENWEATHER_API_KEY,
    units,
    lang: 'uk',
    },
    });
    res.status(200).json({
    success: true,
    data: normalizeCurrentWeather(response.data),
    });
    } catch (error) {
res.status(error.response?.status || 500).json({
success: false,
message: error.response?.data?.message || 'Не вдалося отримати поточну погоду',
});
}
};
export const getForecast = async (req, res) => {
try {
const { city, units = 'metric' } = req.query;
if (!city) {
return res.status(400).json({
success: false,
message: 'Параметр city є обов’язковим',
});}
const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
params: {
q: city,
appid: process.env.OPENWEATHER_API_KEY,
units,
lang: 'uk',
},
});
res.status(200).json({
success: true,
data: normalizeForecast(response.data),
});
} catch (error) {
res.status(error.response?.status || 500).json({
success: false,
message: error.response?.data?.message || 'Не вдалося отримати прогноз погоди',
});
}
};