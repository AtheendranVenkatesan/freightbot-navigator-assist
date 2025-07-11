
import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Truck, Star, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const LoadBooking = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedLoad, setSelectedLoad] = useState<number | null>(null);

  // Mock load data
  const availableLoads = [
    {
      id: 1,
      origin: 'Dallas, TX',
      destination: 'Houston, TX',
      distance: '245 miles',
      rate: '$1,250',
      deadhead: '12 miles',
      pickupDate: '2024-07-12',
      deliveryDate: '2024-07-13',
      weight: '24,500 lbs',
      commodity: 'Electronics',
      rating: 4.8,
      broker: 'Prime Logistics',
      equipment: 'Dry Van',
      status: 'Available',
    },
    {
      id: 2,
      origin: 'Austin, TX',
      destination: 'San Antonio, TX',
      distance: '80 miles',
      rate: '$650',
      deadhead: '8 miles',
      pickupDate: '2024-07-12',
      deliveryDate: '2024-07-12',
      weight: '18,200 lbs',
      commodity: 'Food Products',
      rating: 4.6,
      broker: 'Freight Solutions',
      equipment: 'Reefer',
      status: 'Available',
    },
    {
      id: 3,
      origin: 'Fort Worth, TX',
      destination: 'Oklahoma City, OK',
      distance: '200 miles',
      rate: '$980',
      deadhead: '15 miles',
      pickupDate: '2024-07-13',
      deliveryDate: '2024-07-14',
      weight: '32,100 lbs',
      commodity: 'Building Materials',
      rating: 4.9,
      broker: 'TruckLoad Express',
      equipment: 'Flatbed',
      status: 'Available',
    },
  ];

  const handleBookLoad = (loadId: number) => {
    setSelectedLoad(loadId);
    // Here you would typically make an API call to book the load
    console.log(`Booking load ${loadId}`);
  };

  const getRatePerMile = (rate: string, distance: string) => {
    const rateNum = parseFloat(rate.replace('$', '').replace(',', ''));
    const distanceNum = parseFloat(distance.replace(' miles', ''));
    return (rateNum / distanceNum).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Loads</h2>
          <p className="text-gray-600">Find and book freight loads near you</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Advanced Filters</span>
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by city, state, or ZIP code..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="h-12 text-lg"
              />
            </div>
            <Button size="lg" className="px-8">
              Search Loads
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary">Dallas</Badge>
            <Badge variant="secondary">Houston</Badge>
            <Badge variant="secondary">Austin</Badge>
            <Badge variant="secondary">San Antonio</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Load Results */}
      <div className="space-y-4">
        {availableLoads.map((load) => (
          <Card 
            key={load.id} 
            className={`hover:shadow-lg transition-all duration-200 ${
              selectedLoad === load.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="font-semibold text-lg">
                      {load.origin} → {load.destination}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{load.distance}</span>
                    <span>•</span>
                    <span>{load.equipment}</span>
                    <span>•</span>
                    <span>{load.commodity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{load.rate}</div>
                  <div className="text-sm text-gray-600">
                    ${getRatePerMile(load.rate, load.distance)}/mile
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Pickup</div>
                  <div className="font-medium">{load.pickupDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Delivery</div>
                  <div className="font-medium">{load.deliveryDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Weight</div>
                  <div className="font-medium">{load.weight}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Deadhead</div>
                  <div className="font-medium">{load.deadhead}</div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{load.rating}</span>
                  </div>
                  <span className="text-gray-600">{load.broker}</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {load.status}
                  </Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline">
                    View Details
                  </Button>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleBookLoad(load.id)}
                    disabled={selectedLoad === load.id}
                  >
                    {selectedLoad === load.id ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4 mr-2" />
                        Book Load
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{availableLoads.length}</div>
            <div className="text-sm text-blue-600">Available Loads</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">$2.15</div>
            <div className="text-sm text-green-600">Avg Rate/Mile</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">175 mi</div>
            <div className="text-sm text-orange-600">Avg Distance</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadBooking;
