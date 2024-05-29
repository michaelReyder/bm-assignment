import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectValue,
  SelectTrigger,
} from './ui/select';
import { cities } from '../constants/cities';
import { fetchCurrentWeather, fetchForecastWeather } from '../api/weather';
import { CurrentWeatherResponse } from '../types/response';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Button } from './ui/button';
import ForecastTable from './ForecastTable';

export default function MainView() {
  // Local state
  const [selectedCity, setSelectedCity] = React.useState<string>('');
  const [units, setUnits] = React.useState<'metric' | 'imperial'>('metric');
  const [currentWeather, setCurrentWeather] =
    React.useState<CurrentWeatherResponse>();
  const [weatherData, setWeatherData] =
    React.useState<Map<string, CurrentWeatherResponse[]>>();
  const [showForecast, setShowForecast] = React.useState<boolean>(false);

  // Display helpers
  const degreeSymbol =
    units === 'metric' ? String.fromCharCode(8451) : String.fromCharCode(8457);
  const speedUnits = units === 'metric' ? 'm/s' : 'mph';

  // Data fetch handlers
  const currentWeatherHandler = React.useCallback(async () => {
    if (selectedCity !== '') {
      const res = await fetchCurrentWeather(selectedCity, units);
      setCurrentWeather(res);
      setWeatherData(undefined);
    }
  }, [selectedCity, units]);

  const forecastWeatherHandler = React.useCallback(async () => {
    if (selectedCity !== '' && weatherData === undefined) {
      const res = await fetchForecastWeather(selectedCity, units);
      setWeatherData(res);
    }
  }, [selectedCity, units, weatherData]);

  React.useEffect(() => {
    if (selectedCity !== '') {
      currentWeatherHandler();
    }
  }, [selectedCity, units]);

  return (
    <div className="flex w-full items-center justify-center">
      <Card className="min-w-[50%]">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <RadioGroup
              defaultValue={units}
              onValueChange={(val: 'metric' | 'imperial') => setUnits(val)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="metric" id="r1" />
                <Label htmlFor="r1">{String.fromCharCode(8451)}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="imperial" id="r2" />
                <Label htmlFor="r2">{String.fromCharCode(8457)}</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Select
              onValueChange={(val) => {
                setSelectedCity(val);
              }}
            >
              <SelectTrigger>
                <SelectValue
                  key={selectedCity}
                  placeholder="Please select a city to see the forecast"
                />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.name} value={String(city.id)}>
                    {`${city.name}, ${city.country}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentWeather && (
            <>
              <div className="flex w-full flex-row items-center justify-between py-2">
                <div className="flex flex-col items-start justify-start">
                  <h4 className="scroll-m-18 text-xl font-semibold tracking-tight">
                    {currentWeather.weather.main}
                  </h4>
                  <p>{currentWeather.weather.description}</p>
                  <h4 className="scroll-m-18 text-xl font-semibold tracking-tight">
                    {`${currentWeather.main.temp}`}
                    <>{degreeSymbol}</>
                  </h4>
                  <p>
                    Wind {currentWeather.wind.speed} {speedUnits}
                  </p>
                </div>
                <img
                  src={`https://openweathermap.org/img/wn/${currentWeather.weather.icon}@2x.png`}
                />
              </div>
              {showForecast && weatherData ? (
                <>
                  <Button onClick={() => setShowForecast(false)}>Close</Button>
                  <ForecastTable
                    data={weatherData}
                    degreeSymbol={degreeSymbol}
                    speedUnits={speedUnits}
                  />
                </>
              ) : (
                <Button
                  onClick={() => {
                    forecastWeatherHandler();
                    setShowForecast(true);
                  }}
                >
                  See Forecast
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
