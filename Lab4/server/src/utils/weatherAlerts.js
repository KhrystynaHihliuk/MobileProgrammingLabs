export function buildWeatherAlerts(previousState, currentWeather) {
  const alerts = [];

  const currentTemp = currentWeather.temperature;
  const currentMain = (currentWeather.weatherMain || '').toLowerCase();
  const currentDescription = currentWeather.description || '';
  const currentWind = currentWeather.windSpeed || 0;

  if (['rain', 'drizzle'].includes(currentMain)) {
    alerts.push({
      type: 'rain',
      title: 'Візьміть парасолю',
      body: `У ${currentWeather.city} очікується дощ. Радимо взяти парасолю.`,
    });
  }

  if (currentMain === 'thunderstorm') {
    alerts.push({
      type: 'storm',
      title: 'Попередження про грозу',
      body: `У ${currentWeather.city} спостерігається гроза. Будьте обережні.`,
    });
  }

  if (currentWind >= 10) {
    alerts.push({
      type: 'wind',
      title: 'Сильний вітер',
      body: `У ${currentWeather.city} сильний вітер: ${currentWind} м/с.`,
    });
  }

  if (currentTemp <= 0) {
    alerts.push({
      type: 'freeze',
      title: 'Мороз',
      body: `У ${currentWeather.city} температура опустилася до ${Math.round(
        currentTemp
      )}°C.`,
    });
  }

  if (currentTemp >= 30) {
    alerts.push({
      type: 'heat',
      title: 'Спека',
      body: `У ${currentWeather.city} температура піднялася до ${Math.round(
        currentTemp
      )}°C.`,
    });
  }

  if (previousState) {
    const tempDiff = Math.abs(currentTemp - previousState.temperature);

    if (tempDiff >= 0) {
      alerts.push({
        type: 'temperature_change',
        title: 'Різка зміна температури',
        body: `У ${currentWeather.city} температура змінилася на ${Math.round(
          tempDiff
        )}°C.`,
      });
    }

    const prevMain = (previousState.weatherMain || '').toLowerCase();

    if (
      prevMain !== currentMain &&
      ['rain', 'thunderstorm', 'snow'].includes(currentMain)
    ) {
      alerts.push({
        type: 'weather_change',
        title: 'Погодні умови змінилися',
        body: `У ${currentWeather.city} зараз: ${currentDescription}.`,
      });
    }
  }

  return alerts;
}