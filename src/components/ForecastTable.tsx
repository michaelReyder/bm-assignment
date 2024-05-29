import * as React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { CurrentWeatherResponse } from '../types/response';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export default function ForecastTable({
  data,
  degreeSymbol,
  speedUnits,
}: {
  data: Map<string, CurrentWeatherResponse[]>;
  degreeSymbol: string;
  speedUnits: string;
}) {
  const forecastDays = Array.from(data.keys());
  const [currentDay, setCurrentDay] = React.useState<string>(forecastDays[0]);

  const renderCurrentDayForecast = () => {
    return data.get(currentDay)?.map((forecast) => (
      <TableRow key={forecast.dt}>
        <TableCell>{forecast.time}</TableCell>
        <TableCell>{`${forecast.main.temp}${degreeSymbol}`}</TableCell>
        <TableCell>{`${forecast.main.temp_min}${degreeSymbol}`}</TableCell>
        <TableCell>{`${forecast.main.temp_max}${degreeSymbol}`}</TableCell>
        <TableCell>{`${forecast.wind.speed} ${speedUnits}`}</TableCell>
        <TableCell>{forecast.weather.description}</TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="mt-4 flex w-full flex-col">
      <Tabs className="w-full" defaultValue={currentDay}>
        <TabsList className="grid w-full grid-cols-6">
          {forecastDays.map((day) => (
            <TabsTrigger
              onClick={() => setCurrentDay(day)}
              key={day}
              value={day}
            >
              {day}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Table>
        <TableCaption>Weather information for {currentDay}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Temp</TableHead>
            <TableHead>Min Temp</TableHead>
            <TableHead>Max Temp</TableHead>
            <TableHead>Wind</TableHead>
            <TableHead className="text-right">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderCurrentDayForecast()}</TableBody>
      </Table>
    </div>
  );
}
