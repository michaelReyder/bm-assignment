import { CurrentWeatherResponse } from '../types/response';

const baseUrl = 'https://api.openweathermap.org/data/2.5';
const appId = process.env.REACT_APP_OPENWEATHER_APP_ID;
const corsProxy = 'https://cors-anywhere.herokuapp.com';

export const fetchCurrentWeather = async (
  cityId: string,
  units: string
): Promise<CurrentWeatherResponse> => {
  const url = `${baseUrl}/weather?id=${cityId}&units=${units}&appid=${appId}`;

  try {
    const proxyURL = `${corsProxy}/${url}`;
    const res = await fetch(proxyURL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();

    return normalizeWeatherReponse(data);
  } catch (err) {
    throw err;
  }
};

export const fetchForecastWeather = async (cityId: string, units: string) => {
  const url = `${baseUrl}/forecast?id=${cityId}&units=${units}&appid=${appId}`;

  try {
    const proxyURL = `${corsProxy}/${url}`;
    const res = await fetch(proxyURL, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!res.ok) throw new Error(res.statusText);
    const data = await res.json();
    const forecastByDay = new Map();

    data.list.forEach((item) => {
      const normalizedWeather = normalizeWeatherReponse(item);
      const { date: forecastDate } = normalizedWeather;
      const currentDay = forecastByDay.get(forecastDate);

      if (currentDay) {
        forecastByDay.set(forecastDate, [...currentDay, normalizedWeather]);
      } else {
        forecastByDay.set(forecastDate, [normalizedWeather]);
      }
    });

    return forecastByDay;
  } catch (err) {
    throw err;
  }
};

const normalizeWeatherReponse = (data: any): CurrentWeatherResponse => {
  const date = new Date(data.dt * 1000);
  return {
    weather: {
      id: data.weather[0].id,
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    },
    main: {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      pressure: Math.round(data.main.pressure),
      humidity: Math.round(data.main.humidity),
    },
    wind: {
      speed: Math.round(data.wind.speed),
      deg: data.wind.deg,
    },
    dt: data.dt,
    time: new Date(data.dt * 1000).toLocaleTimeString('en-US', {
      timeStyle: 'short',
    }),
    date: `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`,
  };
};
