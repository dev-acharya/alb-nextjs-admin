'use client';

import React from 'react';
import { Eye, Info } from 'lucide-react';

interface Props {
  inputFieldDetail: any;
  handleInputChange: (e: any) => void;
  categories: any[];
  editId?: string | null;
}

const BasicInfoTab: React.FC<Props> = ({ 
  inputFieldDetail, 
  handleInputChange, 
  categories,
  editId 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Info className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
        <span className="ml-auto text-sm text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Required Fields
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            value={inputFieldDetail.categoryId}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Puja Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Puja Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pujaName"
            value={inputFieldDetail.pujaName}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Enter puja name"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={inputFieldDetail.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Enter price"
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Admin Commission */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin Commission (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="adminCommission"
            value={inputFieldDetail.adminCommission}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Enter commission percentage"
            required
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Discount (%)
          </label>
          <input
            type="number"
            name="discount"
            value={inputFieldDetail.discount}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="Optional discount"
            min="0"
            max="100"
            step="0.01"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            name="duration"
            value={inputFieldDetail.duration}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="e.g., 2-3 hours"
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Languages
          </label>
          <input
            type="text"
            name="languages"
            value={inputFieldDetail.languages}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="e.g., Hindi, English, Sanskrit"
          />
        </div>

        {/* Checkboxes */}
        <div className="md:col-span-2 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="panditRequired"
              checked={inputFieldDetail.panditRequired}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Pandit Required</span>
          </label>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPopular"
              checked={inputFieldDetail.isPopular}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
          </label>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Note:</p>
            <p className="mt-1">Fields marked with <span className="text-red-500">*</span> are required. 
            All other fields are optional but recommended for better user experience.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoTab;