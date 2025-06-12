
import React, { useState, useEffect } from 'react';
import { Users, MapPin, Phone, Plus, Battery, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CircleMember {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  location?: {
    latitude: number;
    longitude: number;
    lastUpdate: string;
  };
  batteryLevel?: number;
  isDriving?: boolean;
  speed?: number;
}

const CircleMembers = () => {
  const [members, setMembers] = useState<CircleMember[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      avatar: '👩‍💼',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        lastUpdate: new Date().toISOString()
      },
      batteryLevel: 0.85,
      isDriving: true,
      speed: 45
    },
    {
      id: '2',
      name: 'Mike Chen',
      phone: '+1 (555) 987-6543',
      avatar: '👨‍💻',
      location: {
        latitude: 40.7580,
        longitude: -73.9855,
        lastUpdate: new Date(Date.now() - 300000).toISOString()
      },
      batteryLevel: 0.32,
      isDriving: false
    },
    {
      id: '3',
      name: 'Emma Davis',
      phone: '+1 (555) 456-7890',
      avatar: '👩‍🎨',
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        lastUpdate: new Date(Date.now() - 900000).toISOString()
      },
      batteryLevel: 0.67,
      isDriving: false
    }
  ]);

  const { toast } = useToast();

  const sendSoundBeacon = (member: CircleMember) => {
    toast({
      title: "Sound Beacon Sent!",
      description: `${member.name}'s device will play a loud sound`,
      variant: "default"
    });
  };

  const addMember = () => {
    toast({
      title: "Invite Sent",
      description: "Family member invitation sent via SMS",
      variant: "default"
    });
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-muted-foreground';
    if (level < 0.2) return 'text-red-500';
    if (level < 0.5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getLastSeenText = (lastUpdate: string) => {
    const diff = Date.now() - new Date(lastUpdate).getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Circle</h2>
          <p className="text-muted-foreground">{members.length} family members</p>
        </div>
        <button
          onClick={addMember}
          className="bg-primary text-primary-foreground p-3 rounded-full hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{member.avatar}</div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.phone}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {member.batteryLevel && (
                      <div className={`flex items-center space-x-1 ${getBatteryColor(member.batteryLevel)}`}>
                        <Battery className="w-4 h-4" />
                        <span className="text-sm">{Math.round(member.batteryLevel * 100)}%</span>
                      </div>
                    )}
                    
                    {member.isDriving && (
                      <div className="flex items-center space-x-1 text-blue-500">
                        <Car className="w-4 h-4" />
                        {member.speed && <span className="text-sm">{member.speed} mph</span>}
                      </div>
                    )}
                  </div>
                </div>

                {member.location && (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {member.location.latitude.toFixed(4)}, {member.location.longitude.toFixed(4)}
                    </span>
                    <span>•</span>
                    <span>{getLastSeenText(member.location.lastUpdate)}</span>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => {
                      if (member.location) {
                        const url = `https://maps.google.com/?q=${member.location.latitude},${member.location.longitude}`;
                        window.open(url, '_blank');
                      }
                    }}
                    className="flex-1 bg-primary/10 text-primary py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center space-x-1"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>View on Map</span>
                  </button>
                  
                  <button
                    onClick={() => sendSoundBeacon(member)}
                    className="flex-1 bg-orange-100 text-orange-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Sound Beacon</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircleMembers;
