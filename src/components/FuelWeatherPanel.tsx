
import React, { useState, useEffect } from 'react';
import { Fuel, Cloud, Thermometer, Wind, Droplets, Sun, AlertTriangle, MapPin, Navigation, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const FuelWeatherPanel = () => {
  const [fuelLevel, setFuelLevel] = useState(65);
  const [weatherApiKey, setWeatherApiKey] = useState('');
  const [mapsApiKey, setMapsApiKey] = useState('');
  const [currentWeather, setCurrentWeather] = useState({
    location: 'Dallas, TX',
    temperature: 78,
    condition: 'Partly Cloudy',
    humidity: 45,
    windSpeed: 12,
    visibility: 10,
  });
  const [showWeatherAlert, setShowWeatherAlert] = useState(false);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [showRadarMap, setShowRadarMap] = useState(false);
  const [showRoadConditions, setShowRoadConditions] = useState(false);

  // Mock fuel stations data
  const nearbyFuelStations = [
    {
      name: 'Pilot Travel Center',
      address: '1247 Interstate 35',
      distance: '2.1 miles',
      price: '$3.89',
      amenities: ['Showers', 'Restaurant', 'Laundry'],
      rating: 4.2,
      lat: 32.7767,
      lng: -96.7970,
    },
    {
      name: 'Love\'s Travel Stop',
      address: '891 Highway 67',
      distance: '3.8 miles',
      price: '$3.85',
      amenities: ['Showers', 'Food Court', 'Parking'],
      rating: 4.5,
      lat: 32.7157,
      lng: -96.8089,
    },
    {
      name: 'TA Petro',
      address: '456 State Road 14',
      distance: '5.2 miles',
      price: '$3.92',
      amenities: ['Full Service', 'Restaurant', 'Shop'],
      rating: 4.0,
      lat: 32.8207,
      lng: -96.8719,
    },
  ];

  // Mock weather forecast
  const weatherForecast = [
    { day: 'Today', high: 82, low: 65, condition: 'Partly Cloudy', icon: 'sun-cloud' },
    { day: 'Tomorrow', high: 79, low: 62, condition: 'Light Rain', icon: 'rain' },
    { day: 'Friday', high: 85, low: 68, condition: 'Sunny', icon: 'sun' },
    { day: 'Saturday', high: 88, low: 71, condition: 'Thunderstorms', icon: 'storm' },
  ];

  // Mock road conditions data
  const roadConditions = [
    { road: 'I-35 North', condition: 'Clear', alert: 'Construction at Mile 127', severity: 'medium' },
    { road: 'I-45 South', condition: 'Wet Roads', alert: 'Heavy rain expected', severity: 'high' },
    { road: 'Highway 67', condition: 'Good', alert: 'No alerts', severity: 'low' },
    { road: 'I-20 East', condition: 'Icy Patches', alert: 'Ice warning - reduce speed', severity: 'high' },
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

  const handleFindFuel = () => {
    console.log('Finding nearest fuel stations...');
    // This would integrate with Google Maps to show directions
    alert('Navigating to nearest fuel station: Pilot Travel Center (2.1 miles)');
  };

  const handleWeatherAlert = () => {
    setShowWeatherAlert(true);
    console.log('Showing weather alerts...');
  };

  const handleRoadConditions = () => {
    setShowRoadConditions(true);
    console.log('Checking road conditions...');
  };

  const handleRadarMap = () => {
    setShowRadarMap(true);
    console.log('Opening weather radar...');
  };

  const handleNavigateToStation = (station: any) => {
    if (mapsApiKey) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}&travelmode=driving`;
      window.open(url, '_blank');
    } else {
      alert(`Navigate to ${station.name} at ${station.address}`);
    }
  };

  const WeatherRadarMap = () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <Cloud className="w-16 h-16 mx-auto text-blue-500 mb-2" />
        <h3 className="text-lg font-semibold">Weather Radar</h3>
        <p className="text-sm text-gray-600">Live weather conditions in your area</p>
      </div>
      {weatherApiKey ? (
        <iframe
          src={`https://embed.windy.com/embed2.html?lat=32.7767&lon=-96.7970&detailLat=32.7767&detailLon=-96.7970&width=650&height=450&zoom=8&level=surface&overlay=radar&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
          width="100%"
          height="300"
          frameBorder="0"
          title="Weather Radar"
          className="rounded-lg"
        />
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Enter your Windy API key to see live radar</p>
          <Input
            placeholder="Enter Windy API key..."
            value={weatherApiKey}
            onChange={(e) => setWeatherApiKey(e.target.value)}
            className="mb-2"
          />
          <Button onClick={() => console.log('API key set')}>Set API Key</Button>
        </div>
      )}
    </div>
  );

  const RouteMap = () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
      <div className="text-center mb-4">
        <MapPin className="w-16 h-16 mx-auto text-green-500 mb-2" />
        <h3 className="text-lg font-semibold">Route Map</h3>
        <p className="text-sm text-gray-600">Current route with fuel stations</p>
      </div>
      {mapsApiKey ? (
        <iframe
          src={`https://www.google.com/maps/embed/v1/directions?key=${mapsApiKey}&origin=Dallas,TX&destination=Houston,TX&waypoints=32.7767,-96.7970|32.7157,-96.8089&mode=driving`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Route Map"
          className="rounded-lg"
        />
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-2">Enter your Google Maps API key to see route</p>
          <Input
            placeholder="Enter Google Maps API key..."
            value={mapsApiKey}
            onChange={(e) => setMapsApiKey(e.target.value)}
            className="mb-2"
          />
          <Button onClick={() => console.log('Maps API key set')}>Set API Key</Button>
        </div>
      )}
    </div>
  );

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
                  <Button size="sm" className="mt-2" onClick={() => handleNavigateToStation(station)}>
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
        <Button variant="outline" className="h-16 flex-col" onClick={handleFindFuel}>
          <Fuel className="w-6 h-6 mb-1" />
          <span className="text-sm">Find Fuel</span>
        </Button>
        
        <Dialog open={showWeatherAlert} onOpenChange={setShowWeatherAlert}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-16 flex-col" onClick={handleWeatherAlert}>
              <Thermometer className="w-6 h-6 mb-1" />
              <span className="text-sm">Weather Alert</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Weather Alerts</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center text-yellow-700 mb-2">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Severe Weather Warning</span>
                </div>
                <p className="text-sm text-yellow-600">
                  Heavy rain and thunderstorms expected in your area between 3:00 PM and 7:00 PM today. 
                  Wind gusts up to 45 mph possible. Exercise caution while driving.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center text-blue-700 mb-2">
                  <Cloud className="w-5 h-5 mr-2" />
                  <span className="font-medium">Visibility Advisory</span>
                </div>
                <p className="text-sm text-blue-600">
                  Fog expected tomorrow morning from 5:00 AM to 9:00 AM. Visibility may be reduced to less than 1 mile.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showRoadConditions} onOpenChange={setShowRoadConditions}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-16 flex-col" onClick={handleRoadConditions}>
              <Wind className="w-6 h-6 mb-1" />
              <span className="text-sm">Road Conditions</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Current Road Conditions</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              {roadConditions.map((road, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  road.severity === 'high' ? 'bg-red-50 border-red-200' :
                  road.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{road.road}</div>
                      <div className="text-sm text-gray-600">{road.condition}</div>
                    </div>
                    <div className={`text-sm font-medium ${
                      road.severity === 'high' ? 'text-red-600' :
                      road.severity === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {road.alert}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showRadarMap} onOpenChange={setShowRadarMap}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-16 flex-col" onClick={handleRadarMap}>
              <Cloud className="w-6 h-6 mb-1" />
              <span className="text-sm">Radar Map</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Weather Radar Map</DialogTitle>
            </DialogHeader>
            <WeatherRadarMap />
          </DialogContent>
        </Dialog>
      </div>

      {/* Route Map Dialog */}
      <Dialog open={showRouteMap} onOpenChange={setShowRouteMap}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Route Map with Fuel Stations</DialogTitle>
          </DialogHeader>
          <RouteMap />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FuelWeatherPanel;
