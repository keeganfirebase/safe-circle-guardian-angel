
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight?: boolean;
}

const FeatureCard = ({ icon: Icon, title, description, highlight = false }: FeatureCardProps) => {
  return (
    <div className={`group relative p-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      highlight 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200' 
        : 'bg-white border border-gray-200 hover:border-blue-300'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
        highlight
          ? 'bg-blue-600 text-white'
          : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
      }`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      
      {highlight && (
        <div className="absolute top-4 right-4">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Premium
          </span>
        </div>
      )}
    </div>
  );
};

export default FeatureCard;
