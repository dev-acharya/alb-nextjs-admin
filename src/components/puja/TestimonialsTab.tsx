'use client';

import React from 'react';
import { MessageSquare, Plus, Trash2, Star, Verified } from 'lucide-react';

interface Props {
  testimonials: any[];
  setTestimonials: (data: any[]) => void;
  addItem: any;
  updateItem: any;
  removeItem: any;
}

const TestimonialsTab: React.FC<Props> = ({
  testimonials,
  setTestimonials,
  addItem,
  updateItem,
  removeItem
}) => {
  const generateStars = (rating: number = 5) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Customer Testimonials</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add authentic testimonials to build trust and credibility
          </p>
        </div>
        <button
          type="button"
          onClick={() => addItem(testimonials, setTestimonials, { 
            highlight: '', 
            quote: '', 
            name: '', 
            location: '',
            rating: 5,
            verified: true,
            date: new Date().toISOString().split('T')[0]
          })}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      <div className="space-y-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Testimonial #{testimonial.id}</h3>
                  <p className="text-xs text-gray-500">Customer feedback</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {testimonial.verified && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <Verified className="w-3 h-3" />
                    Verified
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(testimonials, setTestimonials, testimonial.id)}
                  disabled={testimonials.length <= 1}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Highlight Quote */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highlight Quote *
                  <span className="text-xs text-gray-500 ml-2">(Short impactful quote)</span>
                </label>
                <input
                  type="text"
                  value={testimonial.highlight}
                  onChange={(e) => updateItem(testimonials, setTestimonials, testimonial.id, 'highlight', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium"
                  placeholder="e.g., 'This puja changed my life completely!'"
                  required
                />
              </div>

              {/* Full Testimonial */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Testimonial *
                  <span className="text-xs text-gray-500 ml-2">(Detailed experience)</span>
                </label>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => updateItem(testimonials, setTestimonials, testimonial.id, 'quote', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-h-[120px]"
                  placeholder="Share the full experience in their own words..."
                  required
                />
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={testimonial.name}
                  onChange={(e) => updateItem(testimonials, setTestimonials, testimonial.id, 'name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="e.g., Rajesh Kumar"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={testimonial.location}
                  onChange={(e) => updateItem(testimonials, setTestimonials, testimonial.id, 'location', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="e.g., Mumbai, India"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating (1-5 stars)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {generateStars(testimonial.rating || 5)}
                  </div>
                  <select
                    value={testimonial.rating || 5}
                    onChange={(e) => updateItem(testimonials, setTestimonials, testimonial.id, 'rating', parseInt(e.target.value))}
                    className="ml-2 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} stars</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Verified & Date */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testimonial.verified !== false}
                    onChange={(e) => updateItem(testimonials, setTestimonials, testimonial.id, 'verified', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as Verified</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={testimonial.date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => updateItem(testimonials, setTestimonials, testimonial.id, 'date', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sample Testimonials */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Sample Testimonial Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              highlight: "Life-changing experience!",
              quote: "After performing this puja, I noticed significant positive changes in my life. My career took a new turn and family harmony improved dramatically.",
              name: "Priya Sharma",
              location: "Delhi"
            },
            {
              highlight: "Wish I had done this sooner",
              quote: "The guidance and rituals were exactly what we needed. Our financial situation improved within months of performing this puja.",
              name: "Amit Patel",
              location: "Ahmedabad"
            },
            {
              highlight: "Authentic and powerful",
              quote: "The pandit was knowledgeable and the rituals were performed with devotion. Felt peaceful and blessed throughout.",
              name: "Suresh Menon",
              location: "Chennai"
            },
            {
              highlight: "Highly recommended for students",
              quote: "My son's concentration improved and he scored excellent marks in his exams. This puja was truly beneficial.",
              name: "Geeta Reddy",
              location: "Hyderabad"
            }
          ].map((sample, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 cursor-pointer"
              onClick={() => {
                const newId = testimonials.length > 0 ? Math.max(...testimonials.map(item => item.id)) + 1 : 1;
                setTestimonials([...testimonials, {
                  id: newId,
                  ...sample,
                  rating: 5,
                  verified: true,
                  date: new Date().toISOString().split('T')[0]
                }]);
              }}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {generateStars(5)}
                    </div>
                    <span className="text-xs text-gray-500">Verified</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">"{sample.highlight}"</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{sample.quote}</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  <span className="font-medium">{sample.name}</span>
                  <span className="mx-2">•</span>
                  <span>{sample.location}</span>
                </div>
                <div className="text-red-600 font-medium">Click to add</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsTab;