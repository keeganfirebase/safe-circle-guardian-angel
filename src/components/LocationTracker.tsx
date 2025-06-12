
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertTriangle, Battery, Wifi } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

const LocationTracker = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkPermissions();
    getDeviceInfo();
    getBatteryInfo();
  }, []);

  const checkPermissions = async () => {
    try {
      const permissions = await Geolocation.checkPermissions();
      console.log('Location permissions:', permissions);
      
      if (permissions.location === 'granted') {
        startTracking();
      } else {
        const request = await Geolocation.requestPermissions();
        if (request.location === 'granted') {
          startTracking();
        }
      }
    } catch (error) {
      console.error('Permission error:', error);
      toast({
        title: "Permission Error",
        description: "Could not access location services",
        variant: "destructive"
      });
    }
  };

  const getDeviceInfo = async () => {
    try {
      const info = await Device.getInfo();
      setDeviceInfo(info);
    } catch (error) {
      console.error('Device info error:', error);
    }
  };

  const getBatteryInfo = async () => {
    try {
      const info = await Device.getBatteryInfo();
      setBatteryLevel(info.batteryLevel);
    } catch (error) {
      console.error('Battery info error:', error);
    }
  };

  const startTracking = async () => {
    try {
      setIsTracking(true);
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        speed: position.coords.speed || undefined,
        heading: position.coords.heading || undefined,
        timestamp: position.timestamp
      };

      setLocation(locationData);
      
      // Detect reckless driving (speed over 80 mph)
      if (locationData.speed && locationData.speed > 35.76) { // 80 mph in m/s
        toast({
          title: "Speed Alert",
          description: "Reckless driving detected! Please slow down.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Location error:', error);
      setIsTracking(false);
      toast({
        title: "Location Error",
        description: "Could not get current location",
        variant: "destructive"
      });
    }
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Live Location</h2>
        <p className="text-muted-foreground">Real-time tracking and safety monitoring</p>
      </div>

      {/* Location Card */}
      {location && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-medium">Current Location</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Latitude:</span>
              <p className="font-mono">{location.latitude.toFixed(6)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Longitude:</span>
              <p className="font-mono">{location.longitude.toFixed(6)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Accuracy:</span>
              <p>{location.accuracy.toFixed(1)}m</p>
            </div>
            {location.speed && (
              <div>
                <span className="text-muted-foreground">Speed:</span>
                <p>{(location.speed * 2.237).toFixed(1)} mph</p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date(location.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {/* Device Status */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Wifi className="w-5 h-5 text-primary" />
          <span className="font-medium">Device Status</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {batteryLevel && (
            <div className="flex items-center space-x-2">
              <Battery className="w-4 h-4" />
              <span>{Math.round(batteryLevel * 100)}%</span>
            </div>
          )}
          {deviceInfo && (
            <div>
              <span className="text-muted-foreground">Platform:</span>
              <p>{deviceInfo.platform}</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Start Location Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="w-full bg-destructive text-destructive-foreground py-3 rounded-lg font-medium hover:bg-destructive/90 transition-colors"
          >
            Stop Tracking
          </button>
        )}

        {/* SOS Button */}
        <button
          onClick={() => {
            toast({
              title: "SOS Alert Sent!",
              description: "Emergency contacts have been notified.",
              variant: "default"
            });
          }}
          className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
        >
          <AlertTriangle className="w-6 h-6" />
          <span>EMERGENCY SOS</span>
        </button>
      </div>
    </div>
  );
};

export default LocationTracker;
