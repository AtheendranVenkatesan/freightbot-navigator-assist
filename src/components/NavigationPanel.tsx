
import React, { useState } from 'react';
import { Navigation, MapPin, Clock, Fuel, AlertTriangle, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NavigationPanel = () => {
  const [destination, setDestination] = useState('');
  const [currentRoute, setCurrentRoute] = useState(null);

  // Mock navigation data
  const routeInfo = {
    destination: 'Houston, TX',
    currentLocation: 'Dallas, TX',
    eta: '3:45 PM',
    distance: '245 miles',
    timeRemaining: '3h 45m',
    nextTurn: 'Turn right on I-45 South in 2.1 miles',
    fuelStops: [
      { name: 'Pilot Travel Center', distance: '45 miles', price: '$3.89/gal' },
      { name: 'Love\'s Travel Stop', distance: '120 miles', price: '$3.85/gal' },
    ],
    alerts: [
      { type: 'traffic', message: 'Heavy traffic ahead - 15 min delay', location: 'Mile 178' },
      { type: 'weather', message: 'Light rain expected', location: 'Houston area' },
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Navigation</h2>
          <p className="text-gray-600">Route planning and real-time guidance</p>
        </div>
      </div>

      {/* Route Input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter destination address..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button size="lg" className="px-8">
              <Navigation className="w-5 h-5 mr-2" />
              Start Route
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Route Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <MapPin className="w-5 h-5 mr-2" />
            Active Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Destination</div>
                <div className="font-semibold text-lg">{routeInfo.destination}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">ETA</div>
                  <div className="font-semibold text-green-600">{routeInfo.eta}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Distance</div>
                  <div className="font-semibold">{routeInfo.distance}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border">
              <div className="text-sm text-gray-600 mb-2">Next Direction</div>
              <div className="font-medium text-blue-800">
                {routeInfo.nextTurn}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-0">
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Interactive Map</p>
              <p className="text-sm">Real-time navigation will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic & Weather Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Route Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {routeInfo.alerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-800">{alert.message}</div>
                  <div className="text-sm text-orange-600">{alert.location}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fuel Stops */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fuel className="w-5 h-5 mr-2 text-blue-500" />
              Recommended Fuel Stops
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {routeInfo.fuelStops.map((stop, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-800">{stop.name}</div>
                  <div className="text-sm text-blue-600">{stop.distance} ahead</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{stop.price}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-16 flex-col">
          <Clock className="w-6 h-6 mb-1" />
          <span className="text-sm">Check In</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Fuel className="w-6 h-6 mb-1" />
          <span className="text-sm">Find Fuel</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <MapPin className="w-6 h-6 mb-1" />
          <span className="text-sm">Rest Areas</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col text-red-600 border-red-200">
          <Phone className="w-6 h-6 mb-1" />
          <span className="text-sm">Emergency</span>
        </Button>
      </div>
    </div>
  );
};

export default NavigationPanel;
