import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, LockKeyhole, Download } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Your Family's Safety,
              <span className="block text-blue-600">Simplified.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              SafeCircle is the all-in-one safety app that empowers families to stay connected,
              protected, and informed, no matter where life takes them.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
                <span className="font-semibold text-gray-800">Real-time Location Tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-blue-500" />
                <span className="font-semibold text-gray-800">Trusted Circle Alerts</span>
              </div>
              <div className="flex items-center space-x-3">
                <LockKeyhole className="w-6 h-6 text-blue-500" />
                <span className="font-semibold text-gray-800">Privacy-Focused Security</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/app')}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Launch SafeCircle App
              </button>
              
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Download for iOS</span>
                </button>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                  <Download className="w-5 h-5" />
                  <span>Download for Android</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-500">
                Free for basic use. Premium features available.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="/hero-image.png"
              alt="SafeCircle App Interface"
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute bottom-0 right-0 bg-blue-600 text-white px-4 py-2 rounded-tl-xl rounded-br-xl">
              <span className="text-sm font-medium">#1 Safety App</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
