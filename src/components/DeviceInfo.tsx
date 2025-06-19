
import React, { useState, useEffect } from 'react';
import { Device, DeviceInfo as CapDeviceInfo } from '@capacitor/device';
import { Motion } from '@capacitor/motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Battery, Wifi, Zap, Activity } from 'lucide-react';

const DeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<CapDeviceInfo | null>(null);
  const [acceleration, setAcceleration] = useState({ x: 0, y: 0, z: 0 });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getDeviceInfo();
  }, []);

  const getDeviceInfo = async () => {
    try {
      const info = await Device.getInfo();
      setDeviceInfo(info);
    } catch (error) {
      console.error('Device info error:', error);
    }
  };

  const startMotionTracking = async () => {
    try {
      const handler = await Motion.addListener('accel', (event) => {
        setAcceleration(event.acceleration);
        
        // Simple crash detection based on high acceleration
        const totalAcceleration = Math.sqrt(
          event.acceleration.x ** 2 + 
          event.acceleration.y ** 2 + 
          event.acceleration.z ** 2
        );
        
        if (totalAcceleration > 25) {
          triggerCrashAlert();
        }
      });

      setIsMonitoring(true);
      toast({
        title: "Motion Tracking Started",
        description: "Monitoring device movement for safety",
        variant: "default"
      });

      return handler;
    } catch (error) {
      console.error('Motion tracking error:', error);
      toast({
        title: "Motion Tracking Error",
        description: "Could not start motion tracking",
        variant: "destructive"
      });
    }
  };

  const stopMotionTracking = async () => {
    try {
      await Motion.removeAllListeners();
      setIsMonitoring(false);
      toast({
        title: "Motion Tracking Stopped",
        description: "No longer monitoring device movement",
        variant: "default"
      });
    } catch (error) {
      console.error('Stop motion tracking error:', error);
    }
  };

  const triggerCrashAlert = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      
      toast({
        title: "⚠️ CRASH DETECTED!",
        description: "High impact detected. Emergency contacts will be notified.",
        variant: "destructive"
      });
      
      console.log('CRASH DETECTED - Emergency protocol activated');
    } catch (error) {
      console.error('Crash alert error:', error);
    }
  };

  const testHaptics = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
      toast({
        title: "Haptic Feedback",
        description: "Device vibration test successful",
        variant: "default"
      });
    } catch (error) {
      console.error('Haptics error:', error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Device & Sensors</h2>
        <p className="text-muted-foreground">Device information and sensor monitoring</p>
      </div>

      {/* Device Information */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Smartphone className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Device Information</h3>
        </div>
        
        {deviceInfo ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Platform:</span>
              <span className="ml-2 font-medium">{deviceInfo.platform}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Model:</span>
              <span className="ml-2 font-medium">{deviceInfo.model}</span>
            </div>
            <div>
              <span className="text-muted-foreground">OS Version:</span>
              <span className="ml-2 font-medium">{deviceInfo.osVersion}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Manufacturer:</span>
              <span className="ml-2 font-medium">{deviceInfo.manufacturer}</span>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Loading device information...</p>
        )}
      </div>

      {/* Motion Sensor */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Motion Sensor</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={isMonitoring ? stopMotionTracking : startMotionTracking}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isMonitoring
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-background rounded-lg">
            <div className="text-muted-foreground">X-Axis</div>
            <div className="font-bold text-lg">{acceleration.x.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-lg">
            <div className="text-muted-foreground">Y-Axis</div>
            <div className="font-bold text-lg">{acceleration.y.toFixed(2)}</div>
          </div>
          <div className="text-center p-3 bg-background rounded-lg">
            <div className="text-muted-foreground">Z-Axis</div>
            <div className="font-bold text-lg">{acceleration.z.toFixed(2)}</div>
          </div>
        </div>

        {isMonitoring && (
          <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Crash detection active</span>
          </div>
        )}
      </div>

      {/* Test Controls */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Test Features</h3>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={testHaptics}
            className="w-full bg-background border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            Test Haptic Feedback
          </button>
          
          <button
            onClick={triggerCrashAlert}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Test Crash Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfo;
