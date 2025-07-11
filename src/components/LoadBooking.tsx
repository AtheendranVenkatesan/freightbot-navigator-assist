
import React, { useState } from 'react';
import { MapPin, DollarSign, Clock, Truck, Star, Filter, Eye, AlertTriangle, Fuel } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Load {
  id: number;
  origin: string;
  destination: string;
  distance: string;
  rate: string;
  deadhead: string;
  pickupDate: string;
  deliveryDate: string;
  weight: string;
  commodity: string;
  rating: number;
  broker: string;
  equipment: string;
  status: string;
  description?: string;
  brokerPhone?: string;
  specialInstructions?: string;
}

const LoadBooking = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedLoad, setSelectedLoad] = useState<number | null>(null);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const { toast } = useToast();

  // Extended mock load data with more variety
  const availableLoads: Load[] = [
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
      description: 'High-value electronics shipment requiring secure transport',
      brokerPhone: '(555) 123-4567',
      specialInstructions: 'Temperature controlled, no stacking'
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
      description: 'Frozen food delivery to supermarket chain',
      brokerPhone: '(555) 987-6543',
      specialInstructions: 'Maintain -10°F temperature'
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
      description: 'Steel beams for construction project',
      brokerPhone: '(555) 456-7890',
      specialInstructions: 'Secure tarping required'
    },
    {
      id: 4,
      origin: 'El Paso, TX',
      destination: 'Phoenix, AZ',
      distance: '430 miles',
      rate: '$1,850',
      deadhead: '25 miles',
      pickupDate: '2024-07-14',
      deliveryDate: '2024-07-15',
      weight: '28,800 lbs',
      commodity: 'Automotive Parts',
      rating: 4.7,
      broker: 'Southwest Freight',
      equipment: 'Dry Van',
      status: 'Available',
      description: 'Car parts for automotive assembly plant',
      brokerPhone: '(555) 321-9876',
      specialInstructions: 'Just-in-time delivery critical'
    },
    {
      id: 5,
      origin: 'Amarillo, TX',
      destination: 'Denver, CO',
      distance: '290 miles',
      rate: '$1,450',
      deadhead: '18 miles',
      pickupDate: '2024-07-15',
      deliveryDate: '2024-07-16',
      weight: '26,400 lbs',
      commodity: 'Agricultural Products',
      rating: 4.5,
      broker: 'Plains Transport',
      equipment: 'Dry Van',
      status: 'Available',
      description: 'Grain shipment to processing facility',
      brokerPhone: '(555) 654-3210',
      specialInstructions: 'Load must stay dry'
    },
    {
      id: 6,
      origin: 'Corpus Christi, TX',
      destination: 'New Orleans, LA',
      distance: '350 miles',
      rate: '$1,680',
      deadhead: '30 miles',
      pickupDate: '2024-07-16',
      deliveryDate: '2024-07-17',
      weight: '31,200 lbs',
      commodity: 'Chemicals',
      rating: 4.8,
      broker: 'Gulf Coast Logistics',
      equipment: 'Tanker',
      status: 'Available',
      description: 'Chemical transport - HAZMAT certified drivers only',
      brokerPhone: '(555) 789-0123',
      specialInstructions: 'HAZMAT endorsement required'
    },
    {
      id: 7,
      origin: 'Lubbock, TX',
      destination: 'Albuquerque, NM',
      distance: '220 miles',
      rate: '$1,100',
      deadhead: '12 miles',
      pickupDate: '2024-07-17',
      deliveryDate: '2024-07-18',
      weight: '22,800 lbs',
      commodity: 'Textiles',
      rating: 4.4,
      broker: 'Desert Freight',
      equipment: 'Dry Van',
      status: 'Available',
      description: 'Clothing shipment to retail distribution center',
      brokerPhone: '(555) 234-5678',
      specialInstructions: 'Handle with care - fragile packaging'
    },
    {
      id: 8,
      origin: 'Beaumont, TX',
      destination: 'Shreveport, LA',
      distance: '150 miles',
      rate: '$850',
      deadhead: '22 miles',
      pickupDate: '2024-07-18',
      deliveryDate: '2024-07-19',
      weight: '29,500 lbs',
      commodity: 'Machinery',
      rating: 4.6,
      broker: 'Heavy Haul Pro',
      equipment: 'Lowboy',
      status: 'Available',
      description: 'Industrial equipment transport',
      brokerPhone: '(555) 567-8901',
      specialInstructions: 'Oversize load permits included'
    }
  ];

  React.useEffect(() => {
    setFilteredLoads(availableLoads);
  }, []);

  const handleBookLoad = (loadId: number) => {
    setSelectedLoad(loadId);
    const load = availableLoads.find(l => l.id === loadId);
    
    // Simulate booking process
    setTimeout(() => {
      setSelectedLoad(null);
      toast({
        title: "Load Booked Successfully!",
        description: `You've booked the load from ${load?.origin} to ${load?.destination}. Check your dashboard for pickup details.`,
      });
    }, 2000);
  };

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      setFilteredLoads(availableLoads);
      return;
    }
    
    const filtered = availableLoads.filter(load =>
      load.origin.toLowerCase().includes(searchLocation.toLowerCase()) ||
      load.destination.toLowerCase().includes(searchLocation.toLowerCase())
    );
    setFilteredLoads(filtered);
    
    toast({
      title: "Search Complete",
      description: `Found ${filtered.length} loads matching "${searchLocation}"`,
    });
  };

  const getRatePerMile = (rate: string, distance: string) => {
    const rateNum = parseFloat(rate.replace('$', '').replace(',', ''));
    const distanceNum = parseFloat(distance.replace(' miles', ''));
    return (rateNum / distanceNum).toFixed(2);
  };

  const LoadDetailsDialog = ({ load }: { load: Load }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Truck className="w-5 h-5" />
          <span>Load Details - {load.origin} → {load.destination}</span>
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-600">PICKUP</h4>
            <p className="font-medium">{load.origin}</p>
            <p className="text-sm text-gray-600">{load.pickupDate}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-600">DELIVERY</h4>
            <p className="font-medium">{load.destination}</p>
            <p className="text-sm text-gray-600">{load.deliveryDate}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-semibold text-sm text-gray-600">RATE</h4>
            <p className="text-xl font-bold text-green-600">{load.rate}</p>
            <p className="text-sm text-gray-600">${getRatePerMile(load.rate, load.distance)}/mile</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-600">DISTANCE</h4>
            <p className="font-medium">{load.distance}</p>
            <p className="text-sm text-gray-600">Deadhead: {load.deadhead}</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-gray-600">WEIGHT</h4>
            <p className="font-medium">{load.weight}</p>
            <p className="text-sm text-gray-600">{load.equipment}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-600">COMMODITY</h4>
          <p className="font-medium">{load.commodity}</p>
          <p className="text-sm text-gray-600 mt-1">{load.description}</p>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-600">BROKER CONTACT</h4>
          <p className="font-medium">{load.broker}</p>
          <p className="text-sm text-gray-600">{load.brokerPhone}</p>
        </div>

        {load.specialInstructions && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-sm text-yellow-800 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              SPECIAL INSTRUCTIONS
            </h4>
            <p className="text-sm text-yellow-700 mt-1">{load.specialInstructions}</p>
          </div>
        )}

        <div className="flex space-x-2 pt-4">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
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
                Book This Load
              </>
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

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
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button size="lg" className="px-8" onClick={handleSearch}>
              Search Loads
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {setSearchLocation('Dallas'); handleSearch();}}>Dallas</Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {setSearchLocation('Houston'); handleSearch();}}>Houston</Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {setSearchLocation('Austin'); handleSearch();}}>Austin</Badge>
            <Badge variant="secondary" className="cursor-pointer" onClick={() => {setSearchLocation('San Antonio'); handleSearch();}}>San Antonio</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Load Results */}
      <div className="space-y-4">
        {filteredLoads.map((load) => (
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <LoadDetailsDialog load={load} />
                  </Dialog>
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
            <div className="text-2xl font-bold text-blue-600">{filteredLoads.length}</div>
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
            <div className="text-2xl font-bold text-orange-600">248 mi</div>
            <div className="text-sm text-orange-600">Avg Distance</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoadBooking;
