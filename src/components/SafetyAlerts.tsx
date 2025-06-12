
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Car, MapPin, Clock, Bell } from 'lucide-react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useToast } from '@/hooks/use-toast';

interface SafetyAlert {
  id: string;
  type: 'crash' | 'speeding' | 'unsafe_area' | 'low_battery' | 'sos';
  member: string;
  message: string;
  location?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const SafetyAlerts = () => {
  const [alerts, setAlerts] = useState<SafetyAlert[]>([
    {
      id: '1',
      type: 'speeding',
      member: 'Sarah Johnson',
      message: 'Driving over speed limit (85 mph in 65 mph zone)',
      location: 'Highway 101, San Francisco',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      severity: 'high'
    },
    {
      id: '2',
      type: 'unsafe_area',
      member: 'Mike Chen',
      message: 'Entered high-crime area (Downtown District)',
      location: 'Main St & 5th Ave',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      severity: 'medium'
    },
    {
      id: '3',
      type: 'low_battery',
      member: 'Emma Davis',
      message: 'Device battery critically low (15%)',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      severity: 'low'
    }
  ]);

  const { toast } = useToast();

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    try {
      const permission = await LocalNotifications.requestPermissions();
      console.log('Notification permission:', permission);
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  const getAlertIcon = (type: SafetyAlert['type']) => {
    switch (type) {
      case 'crash':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'speeding':
        return <Car className="w-5 h-5 text-orange-500" />;
      case 'unsafe_area':
        return <MapPin className="w-5 h-5 text-yellow-500" />;
      case 'low_battery':
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      case 'sos':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: SafetyAlert['severity']) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-orange-500 bg-orange-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const markAsRead = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    toast({
      title: "Alert Dismissed",
      description: "Alert has been marked as read",
      variant: "default"
    });
  };

  const sendTestAlert = async () => {
    const newAlert: SafetyAlert = {
      id: Date.now().toString(),
      type: 'crash',
      member: 'Test User',
      message: 'Crash detected! Emergency services contacted.',
      location: 'Current Location',
      timestamp: new Date().toISOString(),
      severity: 'high'
    };

    setAlerts([newAlert, ...alerts]);

    // Send local notification
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'SafeCircle Alert',
            body: newAlert.message,
            id: parseInt(newAlert.id),
            schedule: { at: new Date(Date.now() + 1000) }
          }
        ]
      });
    } catch (error) {
      console.error('Notification error:', error);
    }

    toast({
      title: "Test Alert Sent",
      description: "Check your notifications",
      variant: "default"
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Safety Alerts</h2>
          <p className="text-muted-foreground">{alerts.length} active alerts</p>
        </div>
        <button
          onClick={sendTestAlert}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Test Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">All Safe!</h3>
          <p className="text-muted-foreground">No safety alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border border-border rounded-lg p-4 border-l-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.type)}
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{alert.member}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm">{alert.message}</p>
                  
                  {alert.location && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{alert.location}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                    >
                      Mark as Read
                    </button>
                    
                    {alert.location && (
                      <button
                        onClick={() => {
                          toast({
                            title: "Opening Map",
                            description: "Viewing location on map",
                            variant: "default"
                          });
                        }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        View Location
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafetyAlerts;
