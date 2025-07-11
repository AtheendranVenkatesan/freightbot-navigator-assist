
import React, { useState, useRef } from 'react';
import { Camera, Upload, FileText, Check, X, Scan } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DocumentScanner = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock document history
  const documentHistory = [
    {
      id: 1,
      type: 'Bill of Lading',
      date: '2024-07-11',
      status: 'Verified',
      loadId: 'LD-12345',
    },
    {
      id: 2,
      type: 'Fuel Receipt',
      date: '2024-07-11',
      status: 'Processed',
      amount: '$284.50',
    },
    {
      id: 3,
      type: 'Delivery Receipt',
      date: '2024-07-10',
      status: 'Verified',
      loadId: 'LD-12340',
    },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      simulateOCRScan(file);
    }
  };

  const simulateOCRScan = async (file: File) => {
    setIsScanning(true);
    setScanResult(null);

    // Simulate OCR processing delay
    setTimeout(() => {
      const mockResults = [
        'Bill of Lading #BOL-789456\nShipper: ABC Company\nConsignee: XYZ Corp\nWeight: 24,500 lbs\nPieces: 15 pallets',
        'Fuel Receipt\nPilot Travel Center #1247\nGallons: 75.2\nPrice per gallon: $3.89\nTotal: $292.53\nDate: 07/11/2024',
        'Delivery Receipt\nDelivered to: Warehouse District\nTime: 14:30\nReceived by: John Smith\nCondition: Good'
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setScanResult(randomResult);
      setIsScanning(false);
    }, 2000);
  };

  const handleCameraCapture = () => {
    // In a real app, this would open camera interface
    const mockFile = new File([''], 'camera-capture.jpg', { type: 'image/jpeg' });
    setSelectedFile(mockFile);
    simulateOCRScan(mockFile);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Document Scanner</h2>
          <p className="text-gray-600">Upload and scan bills of lading, receipts, and other documents</p>
        </div>
      </div>

      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-8 text-center">
            <Camera className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Take Photo</h3>
            <p className="text-gray-600 mb-4">Use your device camera to capture documents</p>
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCameraCapture}
            >
              <Camera className="w-5 h-5 mr-2" />
              Open Camera
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardContent className="p-8 text-center">
            <Upload className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload File</h3>
            <p className="text-gray-600 mb-4">Select documents from your device</p>
            <Button 
              className="w-full" 
              size="lg" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose File
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>

      {/* Scanning Status */}
      {isScanning && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div>
                <h3 className="font-semibold text-blue-800">Scanning Document...</h3>
                <p className="text-blue-600">Using OCR to extract text and data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Results */}
      {scanResult && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Check className="w-5 h-5 mr-2" />
              Scan Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium mb-2">Extracted Information:</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {scanResult}
              </pre>
            </div>
            <div className="flex space-x-3 mt-4">
              <Button className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Accept & Save
              </Button>
              <Button variant="outline" className="flex-1">
                <Scan className="w-4 h-4 mr-2" />
                Re-scan
              </Button>
              <Button variant="outline">
                <X className="w-4 h-4 mr-2" />
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Recent Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentHistory.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    doc.status === 'Verified' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <div className="font-medium">{doc.type}</div>
                    <div className="text-sm text-gray-600">
                      {doc.date} • {doc.status}
                      {doc.loadId && ` • ${doc.loadId}`}
                      {doc.amount && ` • ${doc.amount}`}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-16 flex-col">
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-sm">Bill of Lading</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Upload className="w-6 h-6 mb-1" />
          <span className="text-sm">Fuel Receipt</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Check className="w-6 h-6 mb-1" />
          <span className="text-sm">Delivery Proof</span>
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Scan className="w-6 h-6 mb-1" />
          <span className="text-sm">Inspection</span>
        </Button>
      </div>
    </div>
  );
};

export default DocumentScanner;
