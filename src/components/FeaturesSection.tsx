
import { 
  MapPin, 
  AlertTriangle, 
  Shield, 
  Car, 
  Volume2, 
  Users, 
  Battery, 
  Navigation
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Live Tracking",
      description: "Instantly see current locations on Google Maps with detailed driving behavior, speed, battery life, and charging status.",
      highlight: true
    },
    {
      icon: AlertTriangle,
      title: "Crash Detection",
      description: "Automatic alerts to designated circle members in case of accidents, ensuring prompt assistance when needed most."
    },
    {
      icon: Shield,
      title: "Safety Alerts",
      description: "Get notifications when members enter high-crime areas, helping you stay proactive about their safety."
    },
    {
      icon: Car,
      title: "Reckless Driving Detection",
      description: "Receive alerts for speeding or reckless driving behavior, promoting safer driving habits for everyone."
    },
    {
      icon: Navigation,
      title: "SOS Button",
      description: "Always-accessible emergency feature that sends immediate alerts to your safety circle in critical situations."
    },
    {
      icon: Volume2,
      title: "Sound Beacon",
      description: "Trigger a loud ping on a member's device when they're in distress, making them easier to locate."
    },
    {
      icon: Users,
      title: "Customizable Circles",
      description: "Create multiple circles for family, friends, or colleagues with tailored tracking and safety management."
    },
    {
      icon: Battery,
      title: "Device Monitoring",
      description: "Monitor battery levels and charging status to ensure devices stay powered during critical moments."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Comprehensive Safety Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            More features at a lower cost than competitors. Everything you need to keep your loved ones safe in one powerful app.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              highlight={feature.highlight}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
