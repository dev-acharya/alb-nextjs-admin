'use client';

import React from 'react';
import { Plus, Trash2, Star, Heart, Shield, Sparkles, Zap } from 'lucide-react';

const iconOptions = [
  { value: 'CheckCircle', label: 'Check Circle', icon: '✓' },
  { value: 'Star', label: 'Star', icon: '⭐' },
  { value: 'Heart', label: 'Heart', icon: '❤️' },
  { value: 'Shield', label: 'Shield', icon: '🛡️' },
  { value: 'Sparkles', label: 'Sparkles', icon: '✨' },
  { value: 'Zap', label: 'Zap', icon: '⚡' },
  { value: 'Sun', label: 'Sun', icon: '☀️' },
  { value: 'Moon', label: 'Moon', icon: '🌙' },
];

interface Props {
  benefits: any[];
  setBenefits: (benefits: any[]) => void;
  addItem: any;
  updateItem: any;
  removeItem: any;
}

const BenefitsTab: React.FC<Props> = ({
  benefits,
  setBenefits,
  addItem,
  updateItem,
  removeItem
}) => {
  const getIconDisplay = (iconValue: string) => {
    const icon = iconOptions.find(i => i.value === iconValue);
    return icon ? icon.icon : '✓';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Benefits of this Puja</h2>
          <p className="text-sm text-gray-600 mt-1">
            List the key benefits devotees will receive
          </p>
        </div>
        <button
          type="button"
          onClick={() => addItem(benefits, setBenefits, { title: '', description: '', icon: 'CheckCircle' })}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-4 h-4" />
          Add Benefit
        </button>
      </div>

      <div className="space-y-6">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                  <span className="text-lg">{getIconDisplay(benefit.icon)}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Benefit #{benefit.id}</h3>
                  <p className="text-xs text-gray-500">Fill in the details below</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(benefits, setBenefits, benefit.id)}
                disabled={benefits.length <= 1}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => updateItem(benefits, setBenefits, benefit.id, 'title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="e.g., Spiritual Peace"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={benefit.description}
                  onChange={(e) => updateItem(benefits, setBenefits, benefit.id, 'description', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-h-[80px]"
                  placeholder="Describe the benefit in detail..."
                  required
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Icon
                </label>
                <select
                  value={benefit.icon}
                  onChange={(e) => updateItem(benefits, setBenefits, benefit.id, 'icon', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon.value} value={icon.value}>
                      {icon.icon} {icon.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Tips for Benefits Section</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Focus on tangible benefits (peace, prosperity, health, etc.)</li>
          <li>• Keep descriptions clear and concise</li>
          <li>• Use 3-5 key benefits for best results</li>
          <li>• Match icons to the benefit type</li>
        </ul>
      </div>
    </div>
  );
};

export default BenefitsTab;