'use client';

import React, { useState } from 'react';
import { BanknoteIcon, Plus, Trash2, Crown, Check } from 'lucide-react';

interface Props {
  pricingPackages: any[];
  setPricingPackages: (data: any[]) => void;
  addItem: any;
  updateItem: any;
  updatePackageFeature: any;
  addPackageFeature: any;
  removePackageFeature: any;
  handlePopularPackageChange: any;
  removeItem: any;
}

const PackagesTab: React.FC<Props> = ({
  pricingPackages,
  setPricingPackages,
  addItem,
  updateItem,
  updatePackageFeature,
  addPackageFeature,
  removePackageFeature,
  handlePopularPackageChange,
  removeItem
}) => {
  const [showTemplate, setShowTemplate] = useState(false);

  const packageTemplates = [
    {
      title: 'Basic Package',
      price: 999,
      features: ['Standard puja materials', 'Duration: 1-2 hours', 'Basic offerings'],
      recommended: false
    },
    {
      title: 'Premium Package',
      price: 1999,
      features: ['Premium materials', 'Extended duration', 'Special offerings', 'Video recording'],
      recommended: true
    },
    {
      title: 'VIP Package',
      price: 2999,
      features: ['All premium materials', 'Personalized rituals', 'Live streaming', 'Post-puja guidance', 'Gift hamper'],
      recommended: true
    },
    {
      title: 'Family Package',
      price: 3999,
      features: ['For entire family', 'Multiple rituals', 'Extended duration', 'Video recording', 'Family blessings'],
      recommended: false
    }
  ];

  const applyTemplate = (template: any) => {
    const newId = pricingPackages.length > 0 ? Math.max(...pricingPackages.map(item => item.id)) + 1 : 1;
    const newPackage = {
      id: newId,
      title: template.title,
      price: template.price,
      isPopular: template.recommended,
      features: template.features
    };
    setPricingPackages([...pricingPackages, newPackage]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Pricing Packages</h2>
          <p className="text-sm text-gray-600 mt-1">
            Create different packages with varying features and prices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowTemplate(!showTemplate)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {showTemplate ? 'Hide Templates' : 'Show Templates'}
          </button>
          <button
            type="button"
            onClick={() => addItem(pricingPackages, setPricingPackages, { 
              title: '', 
              price: 0, 
              isPopular: false, 
              features: [''] 
            })}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="w-4 h-4" />
            Add Package
          </button>
        </div>
      </div>

      {/* Templates */}
      {showTemplate && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Quick Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packageTemplates.map((template, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-red-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => applyTemplate(template)}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{template.title}</h4>
                    <div className="text-2xl font-bold text-red-600 mt-2">₹{template.price}</div>
                  </div>
                  {template.recommended && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <ul className="space-y-1 mb-4">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <div className="text-sm text-red-600 font-medium">Click to apply</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Packages List */}
      <div className="space-y-8">
        {pricingPackages.map((pkg) => (
          <div key={pkg.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                  <BanknoteIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Package #{pkg.id}</h3>
                  <p className="text-xs text-gray-500">Configure package details</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {pkg.isPopular && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Popular
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(pricingPackages, setPricingPackages, pkg.id)}
                  disabled={pricingPackages.length <= 1}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Package Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  value={pkg.title}
                  onChange={(e) => updateItem(pricingPackages, setPricingPackages, pkg.id, 'title', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="e.g., Basic, Premium, VIP"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={pkg.price}
                  onChange={(e) => updateItem(pricingPackages, setPricingPackages, pkg.id, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="0"
                  required
                  min="0"
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={pkg.originalPrice || ''}
                  onChange={(e) => updateItem(pricingPackages, setPricingPackages, pkg.id, 'originalPrice', parseFloat(e.target.value) || '')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="For showing discount"
                  min="0"
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Display
                </label>
                <input
                  type="text"
                  value={pkg.discount || ''}
                  onChange={(e) => updateItem(pricingPackages, setPricingPackages, pkg.id, 'discount', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="e.g., 20% OFF"
                />
              </div>
            </div>

            {/* Features Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Package Features *
                </label>
                <button
                  type="button"
                  onClick={() => addPackageFeature(pkg.id)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
              </div>
              
              <div className="space-y-3">
                {pkg.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updatePackageFeature(pkg.id, index, e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        placeholder="Enter feature (e.g., Video recording included)"
                        required
                      />
                    </div>
                    {pkg.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePackageFeature(pkg.id, index)}
                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Package Toggle */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-1">Mark as Popular Package</h4>
                <p className="text-xs text-gray-500">
                  Only one package can be marked as popular. This will be highlighted to users.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pkg.isPopular}
                  onChange={() => handlePopularPackageChange(pkg.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Strategy Tips */}
      <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Pricing Strategy Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-red-700">Basic Package</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Entry-level pricing</li>
              <li>• Essential features only</li>
              <li>• For budget-conscious users</li>
              <li>• Good for first-timers</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-red-700">Premium Package</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Value for money</li>
              <li>• Most popular choice</li>
              <li>• Balanced features</li>
              <li>• Recommended option</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-red-700">VIP Package</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Premium experience</li>
              <li>• All features included</li>
              <li>• Highest price point</li>
              <li>• For special occasions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesTab;