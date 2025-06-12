
import { Smartphone, Download } from 'lucide-react';

const DownloadSection = () => {
  return (
    <section id="download" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <Smartphone className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Take the First Step Towards
            <span className="block">A Safer Tomorrow</span>
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Download SafeCircle today and experience peace of mind with our all-inclusive safety solution designed for modern families.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-3">
            <Download className="w-6 h-6" />
            <span>Download for iOS</span>
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105 flex items-center space-x-3">
            <Download className="w-6 h-6" />
            <span>Download for Android</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">Free</div>
            <div className="text-blue-100">Basic tracking for families</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">$4.99/mo</div>
            <div className="text-blue-100">Premium features included</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">30 Days</div>
            <div className="text-blue-100">Free trial period</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadSection;
