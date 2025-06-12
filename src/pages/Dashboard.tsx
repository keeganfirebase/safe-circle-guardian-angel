
import React, { useState, useEffect } from 'react';
import { Users, MapPin, Shield, Settings, Camera, Bell } from 'lucide-react';
import LocationTracker from '@/components/LocationTracker';
import CircleMembers from '@/components/CircleMembers';
import SafetyAlerts from '@/components/SafetyAlerts';
import CameraCapture from '@/components/CameraCapture';
import DeviceInfo from '@/components/DeviceInfo';
import { useCapacitorApp } from '@/hooks/useCapacitorApp';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('map');
  const { isNative } = useCapacitorApp();

  const tabs = [
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'circle', label: 'Circle', icon: Users },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'camera', label: 'Camera', icon: Camera },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">SafeCircle</h1>
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            {isNative && <span className="text-xs bg-accent px-2 py-1 rounded">Mobile</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'map' && <LocationTracker />}
        {activeTab === 'circle' && <CircleMembers />}
        {activeTab === 'safety' && <SafetyAlerts />}
        {activeTab === 'camera' && <CameraCapture />}
        {activeTab === 'settings' && <DeviceInfo />}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-card border-t border-border">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 p-4 flex flex-col items-center space-y-1 transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
