'use client';

import React from 'react';
import { Users, Plus, Trash2, User, UserCheck, GraduationCap, Briefcase, Home, Heart } from 'lucide-react';

const iconOptions = [
  { value: 'Users', label: 'Users', icon: '👥' },
  { value: 'User', label: 'Single Person', icon: '👤' },
  { value: 'UserCheck', label: 'Verified User', icon: '👨‍💼' },
  { value: 'GraduationCap', label: 'Student', icon: '🎓' },
  { value: 'Briefcase', label: 'Professional', icon: '💼' },
  { value: 'Home', label: 'Family', icon: '🏠' },
  { value: 'Heart', label: 'Couples', icon: '❤️' },
  { value: 'Baby', label: 'New Parents', icon: '👶' },
  { value: 'Building', label: 'Business Owners', icon: '🏢' },
  { value: 'Award', label: 'Achievers', icon: '🏆' },
];

interface Props {
  whoShouldBook: any[];
  setWhoShouldBook: (data: any[]) => void;
  addItem: any;
  updateItem: any;
  removeItem: any;
}

const WhoShouldBookTab: React.FC<Props> = ({
  whoShouldBook,
  setWhoShouldBook,
  addItem,
  updateItem,
  removeItem
}) => {
  const getIconDisplay = (iconValue: string) => {
    const icon = iconOptions.find(i => i.value === iconValue);
    return icon ? icon.icon : '👥';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Who Should Book This Puja</h2>
          <p className="text-sm text-gray-600 mt-1">
            Specify target audience who will benefit most from this puja
          </p>
        </div>
        <button
          type="button"
          onClick={() => addItem(whoShouldBook, setWhoShouldBook, { 
            title: '', 
            description: '', 
            icon: 'Users' 
          })}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="space-y-6">
        {whoShouldBook.map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center">
                  <span className="text-lg">{getIconDisplay(category.icon)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Category #{category.id}</h3>
                  <p className="text-xs text-gray-500">Target audience segment</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(whoShouldBook, setWhoShouldBook, category.id)}
                disabled={whoShouldBook.length <= 1}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Title *
                </label>
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => updateItem(whoShouldBook, setWhoShouldBook, category.id, 'title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="e.g., Students, Professionals, Couples"
                  required
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Icon
                </label>
                <select
                  value={category.icon}
                  onChange={(e) => updateItem(whoShouldBook, setWhoShouldBook, category.id, 'icon', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.icon} {icon.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why They Should Book *
                </label>
                <textarea
                  value={category.description}
                  onChange={(e) => updateItem(whoShouldBook, setWhoShouldBook, category.id, 'description', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-h-[80px]"
                  placeholder="Explain why this category of people should perform this puja..."
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Audience Categories */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Common Audience Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Students', icon: '🎓', desc: 'For academic success' },
            { title: 'Professionals', icon: '💼', desc: 'Career growth' },
            { title: 'Couples', icon: '❤️', desc: 'Marital harmony' },
            { title: 'Business Owners', icon: '🏢', desc: 'Business prosperity' },
            { title: 'New Parents', icon: '👶', desc: 'Child welfare' },
            { title: 'Seniors', icon: '👴', desc: 'Health & peace' },
            { title: 'Health Issues', icon: '🏥', desc: 'Healing & recovery' },
            { title: 'Financial Stress', icon: '💰', desc: 'Wealth & stability' },
          ].map((category, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 text-center hover:border-red-300 transition-colors cursor-pointer"
              onClick={() => {
                const newId = whoShouldBook.length > 0 ? Math.max(...whoShouldBook.map(item => item.id)) + 1 : 1;
                setWhoShouldBook([...whoShouldBook, {
                  id: newId,
                  title: category.title,
                  description: `${category.desc}. This puja is specifically beneficial for...`,
                  icon: 'Users'
                }]);
              }}>
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="font-medium text-gray-800">{category.title}</div>
              <div className="text-xs text-gray-500 mt-1">{category.desc}</div>
              <div className="text-xs text-red-600 mt-2">Click to add</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhoShouldBookTab;