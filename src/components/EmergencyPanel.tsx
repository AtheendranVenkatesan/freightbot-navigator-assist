
import React, { useState } from 'react';
import { Phone, MapPin, AlertTriangle, MessageSquare, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const EmergencyPanel = () => {
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [emergencyType, setEmergencyType] = useState('');

  const emergencyContacts = [
    {
      name: 'Emergency Services',
      number: '911',
      type: 'emergency',
      description: 'Police, Fire, Medical',
    },
    {
      name: 'Dispatch Office',
      number: '(555) 123-4567',
      type: 'dispatch',
      description: 'Your company dispatch',
    },
    {
      name: 'Roadside Assistance',
      number: '(555) 987-6543',
      type: 'roadside',
      description: '24/7 truck assistance',
    },
    {
      name: 'DOT Hotline',
      number: '(555) 555-0123',
      type: 'dot',
      description: 'Department of Transportation',
    },
  ];

  const emergencyTypes = [
    { id: 'medical', label: 'Medical Emergency', color: 'red', icon: AlertTriangle },
    { id: 'accident', label: 'Traffic Accident', color: 'orange', icon: AlertTriangle },
    { id: 'breakdown', label: 'Vehicle Breakdown', color: 'yellow', icon: AlertTriangle },
    { id: 'security', label: 'Security Issue', color: 'purple', icon: AlertTriangle },
  ];

  const handleEmergencyCall = (number: string, name: string) => {
    // In a real app, this would initiate a phone call
    console.log(`Calling ${name} at ${number}`);
    
    // For web app, we could show a modal with instructions
    alert(`Emergency call initiated to ${name}\nNumber: ${number}\n\nOn mobile devices, this would automatically dial the number.`);
  };

  const handleSendAlert = () => {
    if (!emergencyType || !emergencyMessage.trim()) {
      alert('Please select emergency type and enter a message');
      return;
    }

    // Mock sending emergency alert
    console.log('Emergency alert sent:', { type: emergencyType, message: emergencyMessage });
    
    // Show confirmation
    alert('Emergency alert sent successfully!\n\nYour location and message have been transmitted to dispatch and emergency contacts.');
    
    // Reset form
    setEmergencyType('');
    setEmergencyMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-red-600">Emergency Assistance</h2>
          <p className="text-gray-600">Quick access to emergency services and support</p>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">Emergency Mode Active</h3>
              <p className="text-red-600">
                Your location is being tracked. Help is available 24/7.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Emergency Calls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyContacts.map((contact, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
              contact.type === 'emergency' ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'hover:scale-105'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    contact.type === 'emergency' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-600">{contact.description}</div>
                    <div className="text-lg font-mono text-blue-600 mt-1">{contact.number}</div>
                  </div>
                </div>
                <Button 
                  size="lg"
                  className={contact.type === 'emergency' ? 'bg-red-600 hover:bg-red-700' : ''}
                  onClick={() => handleEmergencyCall(contact.number, contact.name)}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emergency Alert Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            Send Emergency Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {emergencyTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.id}
                    variant={emergencyType === type.id ? "default" : "outline"}
                    className="h-16 flex-col text-sm"
                    onClick={() => setEmergencyType(type.id)}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Details
            </label>
            <Textarea
              placeholder="Describe your emergency situation, location details, and any immediate needs..."
              value={emergencyMessage}
              onChange={(e) => setEmergencyMessage(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-blue-800">Current Location</div>
                <div className="text-sm text-blue-600">
                  Interstate 35, Mile Marker 247, Dallas, TX
                </div>
                <div className="text-xs text-blue-500 mt-1">
                  GPS coordinates will be automatically included in your alert
                </div>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full bg-red-600 hover:bg-red-700 text-lg font-semibold h-14"
            onClick={handleSendAlert}
          >
            <AlertTriangle className="w-6 h-6 mr-2" />
            Send Emergency Alert
          </Button>
        </CardContent>
      </Card>

      {/* Safety Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Safety Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <div className="font-medium">24/7 Support</div>
              <div className="text-sm text-gray-600">Always available when you need help</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <div className="font-medium">GPS Tracking</div>
              <div className="text-sm text-gray-600">Your location is automatically shared</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Phone className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <div className="font-medium">Direct Connect</div>
              <div className="text-sm text-gray-600">Instant connection to emergency services</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyPanel;
