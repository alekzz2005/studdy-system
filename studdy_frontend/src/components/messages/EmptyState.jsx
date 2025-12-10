import { Search } from 'lucide-react';

const EmptyState = ({ icon: Icon = Search, message, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-gray-500 text-center">{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-2 text-green-600 hover:text-green-700 text-sm"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;