import admin from '../utils/firebaseAdmin.js';
import { WebPushToken } from '../models/WebPushToken.js';
import { WeatherAlertState } from '../models/WeatherAlertState.js';
import { buildWeatherAlerts } from '../utils/weatherAlerts.js';
import { City } from '../models/City.js';

export const registerWebToken = async (req, res) => {
  try {
    const { token, platform = 'web' } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Web token є обов’язковим',
      });
    }

    const saved = await WebPushToken.findOneAndUpdate(
      { token },
      {
        user: req.user._id,
        token,
        platform,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Сповіщення для браузера увімкнено',
      data: saved,
    });
  } catch (error) {
    console.error('REGISTER WEB TOKEN ERROR:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Не вдалося зберегти web token',
    });
  }
};

export const sendWebTestNotification = async (req, res) => {
  try {
    const device = await WebPushToken.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Спочатку потрібно увімкнути сповіщення для браузера',
      });
    }

    const message = {
      token: device.token,
      notification: {
        title: 'Тестове погодне сповіщення',
        body: 'Firebase Cloud Messaging успішно працює для цього застосунку.',
      },
      data: {
        type: 'test',
        screen: 'WeatherDetails',
        city: '',
      },
      webpush: {
        notification: {
          icon: '/favicon.png',
          badge: '/favicon.png',
          tag: 'weather-test',
          requireInteraction: true,
        },
      },
    };

    const response = await admin.messaging().send(message);

    return res.status(200).json({
      success: true,
      message: 'Тестове хмарне сповіщення надіслано',
      data: response,
    });
  } catch (error) {
    console.error('SEND WEB TEST ERROR:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Не вдалося надіслати test push',
    });
  }
};

export const checkWeatherAlerts = async (req, res) => {
  try {
    const { cityId } = req.body || {};

    let cityDoc = null;

    if (cityId) {
      cityDoc = await City.findOne({
        _id: cityId,
        owner: req.user._id,
      });
    }

    if (!cityDoc) {
      cityDoc = await City.findOne({ owner: req.user._id }).sort({
        createdAt: -1,
      });
    }

    if (!cityDoc) {
      return res.status(404).json({
        success: false,
        message: 'У користувача немає збережених міст',
      });
    }

    const weatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
    weatherUrl.searchParams.set('q', cityDoc.name);
    weatherUrl.searchParams.set('units', cityDoc.units || 'metric');
    weatherUrl.searchParams.set('appid', process.env.OPENWEATHER_API_KEY);
    weatherUrl.searchParams.set('lang', 'uk');

    const weatherResponse = await fetch(weatherUrl);
    const weatherJson = await weatherResponse.json();

    if (!weatherResponse.ok) {
      return res.status(400).json({
        success: false,
        message: weatherJson?.message || 'Не вдалося отримати погодні дані',
      });
    }

    const currentWeather = {
      city: weatherJson.name,
      country: weatherJson.sys?.country || '',
      temperature: weatherJson.main?.temp ?? 0,
      humidity: weatherJson.main?.humidity ?? 0,
      pressure: weatherJson.main?.pressure ?? 0,
      windSpeed: weatherJson.wind?.speed ?? 0,
      description: weatherJson.weather?.[0]?.description ?? '',
      weatherMain: weatherJson.weather?.[0]?.main ?? '',
    };

    const previousState = await WeatherAlertState.findOne({
      user: req.user._id,
      city: cityDoc.name,
    });

    const alerts = buildWeatherAlerts(previousState, currentWeather);

    await WeatherAlertState.findOneAndUpdate(
      { user: req.user._id, city: cityDoc.name },
      {
        user: req.user._id,
        city: cityDoc.name,
        country: currentWeather.country,
        temperature: currentWeather.temperature,
        weatherMain: currentWeather.weatherMain,
        description: currentWeather.description,
        windSpeed: currentWeather.windSpeed,
        pressure: currentWeather.pressure,
        humidity: currentWeather.humidity,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (alerts.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Небезпечних або різких змін погоди не виявлено',
        data: {
          city: currentWeather.city,
          alerts: [],
          weather: currentWeather,
        },
      });
    }

    const device = await WebPushToken.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!device) {
      return res.status(200).json({
        success: true,
        message: 'Погодні зміни знайдено, але сповіщення для браузера ще не увімкнено',
        data: {
          city: currentWeather.city,
          alerts,
          weather: currentWeather,
        },
      });
    }

    const pushResults = [];

    for (const alert of alerts) {
      const message = {
        token: device.token,
        notification: {
          title: alert.title,
          body: alert.body,
        },
        data: {
          type: alert.type,
          city: currentWeather.city,
          screen: 'WeatherDetails',
        },
        webpush: {
          notification: {
            icon: '/favicon.png',
            badge: '/favicon.png',
            tag: `weather-${alert.type}`,
            requireInteraction: true,
          },
        },
      };

      const result = await admin.messaging().send(message);
      pushResults.push(result);
    }

    return res.status(200).json({
      success: true,
      message: 'Погодні сповіщення перевірено',
      data: {
        city: currentWeather.city,
        alerts,
        weather: currentWeather,
        pushResults,
      },
    });
  } catch (error) {
    console.error('CHECK WEATHER ALERTS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Не вдалося перевірити погодні сповіщення',
    });
  }
};