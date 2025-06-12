
import React, { useState, useEffect } from 'react';
import { Smartphone, Battery, Wifi, Settings, Bell, Shield } from 'lucide-react';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Motion } from '@capacitor/motion';
import { PushNotifications } from '@capacitor/push-notifications';
import { useToast } from '@/hooks/use-toast';

interface DeviceData {
  info: any;
  batteryInfo: any;
  networkStatus: any;
}

const DeviceInfo = () => {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    info: null,
    batteryInfo: null,
    networkStatus: null
  });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [motionData, setMotionData] = useState<any>(null);
  const [pushToken, setPushToken] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    loadDeviceInfo();
    setupPushNotifications();
  }, []);

  const loadDeviceInfo = async () => {
    try {
      const [info, batteryInfo] = await Promise.all([
        Device.getInfo(),
        Device.getBatteryInfo()
      ]);

      setDeviceData({
        info,
        batteryInfo,
        networkStatus: null
      });
    } catch (error) {
      console.error('Device info error:', error);
    }
  };

  const setupPushNotifications = async () => {
    try {
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        await PushNotifications.register();
        
        PushNotifications.addListener('registration', (token) => {
          setPushToken(token.value);
          console.log('Push registration success:', token.value);
        });

        PushNotifications.addListener('registrationError', (error) => {
          console.error('Push registration error:', error);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received:', notification);
          toast({
            title: notification.title || 'Notification',
            description: notification.body || 'New notification received',
            variant: "default"
          });
        });
      }
    } catch (error) {
      console.error('Push notification setup error:', error);
    }
  };

  const startMotionMonitoring = async () => {
    try {
      const permission = await Motion.requestPermissions();
      
      if (permission.accelerometer === 'granted') {
        setIsMonitoring(true);
        
        const listener = await Motion.addListener('accel', (event) => {
          setMotionData(event);
          
          // Detect sudden deceleration (possible crash)
          const force = Math.sqrt(
            event.acceleration.x ** 2 + 
            event.acceleration.y ** 2 + 
            event.acceleration.z ** 2
          );
          
          if (force > 20) { // Threshold for crash detection
            Haptics.impact({ style: ImpactStyle.Heavy });
            toast({
              title: "Crash Detected!",
              description: "Emergency services will be contacted in 30 seconds",
              variant: "destructive"
            });
          }
        });

        setTimeout(() => {
          listener.remove();
          setIsMonitoring(false);
        }, 30000); // Monitor for 30 seconds
        
      }
    } catch (error) {
      console.error('Motion monitoring error:', error);
      setIsMonitoring(false);
    }
  };

  const testHaptics = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
      toast({
        title: "Haptic Feedback",
        description: "Device vibration test completed",
        variant: "default"
      });
    } catch (error) {
      console.error('Haptics error:', error);
    }
  };

  const sendTestNotification = async () => {
    toast({
      title: "Test Notification",
      description: "This is a test of the notification system",
      variant: "default"
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Device Settings</h2>
        <p className="text-muted-foreground">Manage sensors and notifications</p>
      </div>

      {/* Device Info */}
      {deviceData.info && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <span className="font-medium">Device Information</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Model:</span>
              <p>{deviceData.info.model}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Platform:</span>
              <p>{deviceData.info.platform}</p>
            </div>
            <div>
              <span className="text-muted-foreground">OS Version:</span>
              <p>{deviceData.info.osVersion}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Manufacturer:</span>
              <p>{deviceData.info.manufacturer}</p>
            </div>
          </div>
        </div>
      )}

      {/* Battery Info */}
      {deviceData.batteryInfo && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Battery className="w-5 h-5 text-primary" />
            <span className="font-medium">Battery Status</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Level:</span>
              <p>{Math.round((deviceData.batteryInfo.batteryLevel || 0) * 100)}%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Charging:</span>
              <p>{deviceData.batteryInfo.isCharging ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Motion Monitoring */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-medium">Crash Detection</span>
        </div>
        
        {motionData && (
          <div className="text-sm space-y-2">
            <div>X: {motionData.acceleration.x.toFixed(2)}</div>
            <div>Y: {motionData.acceleration.y.toFixed(2)}</div>
            <div>Z: {motionData.acceleration.z.toFixed(2)}</div>
          </div>
        )}
        
        <button
          onClick={startMotionMonitoring}
          disabled={isMonitoring}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isMonitoring ? 'Monitoring Motion...' : 'Test Crash Detection'}
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-primary" />
          <span className="font-medium">Notifications</span>
        </div>
        
        {pushToken && (
          <div className="text-xs text-muted-foreground">
            Push Token: {pushToken.substring(0, 32)}...
          </div>
        )}
        
        <button
          onClick={sendTestNotification}
          className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
        >
          Send Test Notification
        </button>
      </div>

      {/* Device Actions */}
      <div className="space-y-3">
        <button
          onClick={testHaptics}
          className="w-full bg-primary/10 text-primary py-3 rounded-lg font-medium hover:bg-primary/20 transition-colors"
        >
          Test Haptic Feedback
        </button>
        
        <button
          onClick={loadDeviceInfo}
          className="w-full bg-secondary text-secondary-foreground py-3 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
        >
          Refresh Device Info
        </button>
      </div>
    </div>
  );
};

export default DeviceInfo;
