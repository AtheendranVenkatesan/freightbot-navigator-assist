
import React, { useState, useEffect } from 'react';
import { Fuel, Cloud, Thermometer, Wind, Droplets, Sun, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const FuelWeatherPanel = () => {
  const [fuelLevel, setFuelLevel] = useState(65);
  const [currentWeather, setCurrentWeather] = useState({
    location: 'Dallas, TX',
    temperature: 78,
    condition: 'Partly Cloudy',
    humidity: 45,
    windSpeed: 12,
    visibility: 10,
  });

  // Mock fuel stations data
  const nearbyFuelStations = [
    {
      name: 'Pilot Travel Center',
      address: '1247 Interstate 35',
      distance: '2.1 miles',
      price: '$3.89',
      amenities: ['Showers', 'Restaurant', 'Laundry'],
      rating: 4.2,
    },
    {
      name: 'Love\'s Travel Stop',
      address: '891 Highway 67',
      distance: '3.8 miles',
      price: '$3.85',
      amenities: ['Showers', 'Food Court', 'Parking'],
      rating: 4.5,
    },
    {
      name: 'TA Petro',
      address: '456 State Road 14',
      distance: '5.2 miles',
      price: '$3.92',
      amenities: ['Full Service', 'Restaurant', 'Shop'],
      rating: 4.0,
    },
  ];

  // Mock weather forecast
  const weatherForecast = [
    { day: 'Today', high: 82, low: 65, condition: 'Partly Cloudy', icon: 'sun-cloud' },
    { day: 'Tomorrow', high: 79, low: 62, condition: 'Light Rain', icon: 'rain' },
    { day: 'Friday', high: 85, low: 68, condition: 'Sunny', icon: 'sun' },
    { day: 'Saturday', high: 88, low: 71, condition: 'Thunderstorms', icon: 'storm' },
  ];

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return 'bg-green-500';
    if (level > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getFuelLevelText = (level: number) => {
    if (level > 50) return 'Good';
    if (level > 25) return 'Low';
    return 'Critical';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fuel & Weather</h2>
          <p className="text-gray-600">Monitor fuel levels and weather conditions</p>
        </div>
      </div>

      {/* Fuel Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fuel className="w-5 h-5 mr-2 text-blue-500" />
              Fuel Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{fuelLevel}%</div>
                <div className={`text-lg font-medium ${
                  fuelLevel > 50 ? 'text-green-600' : fuelLevel > 25 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {getFuelLevelText(fuelLevel)}
                </div>
              </div>
              
              <Progress value={fuelLevel} className="h-4" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Estimated Range</div>
                  <div className="font-semibold">420 miles</div>
                </div>
                <div>
                  <div className="text-gray-600">Last Fill-up</div>
                  <div className="font-semibold">Yesterday</div>
                </div>
              </div>

              {fuelLevel < 30 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center text-red-700">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Low Fuel Warning</span>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    Consider refueling soon. Nearest station is 2.1 miles away.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Weather */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="w-5 h-5 mr-2 text-blue-500" />
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{currentWeather.temperature}°F</div>
                <div className="text-lg text-gray-600">{currentWeather.condition}</div>
                <div className="text-sm text-gray-500">{currentWeather.location}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <Droplets className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                  <div className="font-medium">{currentWeather.humidity}%</div>
                  <div className="text-gray-600">Humidity</div>
                </div>
                <div className="text-center">
                  <Wind className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                  <div className="font-medium">{currentWeather.windSpeed} mph</div>
                  <div className="text-gray-600">Wind</div>
                </div>
                <div className="text-center">
                  <Sun className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
                  <div className="font-medium">{currentWeather.visibility} mi</div>
                  <div className="text-gray-600">Visibility</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weather Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>4-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weatherForecast.map((day, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">{day.day}</div>
                <div className="w-8 h-8 mx-auto mb-2 text-blue-500">
                  <Cloud className="w-full h-full" />
                </div>
                <div className="text-sm text-gray-600 mb-1">{day.condition}</div>
                <div className="font-semibold">
                  {day.high}° / {day.low}°
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nearby Fuel Stations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fuel className="w-5 h-5 mr-2" />
            Nearby Fuel Stations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nearbyFuelStations.map((station, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{station.name}</div>
                  <div className="text-sm text-gray-600">{station.address}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {station.distance} • Rating: {station.rating}★
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {station.amenities.map((amenity, idx) => (
                      <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-lg font-bold text-green-600">{station.price}</div>
                  <div className="text-sm text-gray-600">per gallon</div>
                  <Button size="sm" className="mt-2">
                    Navigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-16 flex-col">
          <Fuel className="w-6 h-6 mb-1" />
          <span className="text-sm">Find Fuel</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Thermometer className="w-6 h-6 mb-1" />
          <span className="text-sm">Weather Alert</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Wind className="w-6 h-6 mb-1" />
          <span className="text-sm">Road Conditions</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Cloud className="w-6 h-6 mb-1" />
          <span className="text-sm">Radar Map</span>
        </Button>
      </div>
    </div>
  );
};

export default FuelWeatherPanel;
