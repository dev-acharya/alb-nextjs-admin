'use client';

import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  faqs: any[];
  setFaqs: (data: any[]) => void;
  addItem: any;
  updateItem: any;
  removeItem: any;
}

const FAQsTab: React.FC<Props> = ({
  faqs,
  setFaqs,
  addItem,
  updateItem,
  removeItem
}) => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const commonFAQs = [
    {
      question: "How long does the puja take?",
      answer: "The puja typically takes 2-3 hours, including preparation time. The exact duration may vary based on specific rituals and customization."
    },
    {
      question: "What materials are needed for the puja?",
      answer: "All essential materials are provided by our pandits. You only need to arrange basic items like flowers, fruits, and incense as per your convenience. A detailed list will be shared before the puja."
    },
    {
      question: "Can the puja be performed remotely?",
      answer: "Yes, we offer both in-person and remote puja options. For remote pujas, our pandit will guide you through the process via video call and perform rituals on your behalf."
    },
    {
      question: "Is a pandit included in the package?",
      answer: "Yes, an experienced pandit is included in all our packages. They bring all necessary materials and guide you through the entire process."
    },
    {
      question: "What is your cancellation policy?",
      answer: "You can cancel up to 24 hours before the scheduled puja for a full refund. Cancellations within 24 hours may incur a nominal fee to cover preparation costs."
    },
    {
      question: "Can we customize the puja rituals?",
      answer: "Absolutely! We can customize rituals based on your specific needs, family traditions, or astrological guidance. Please mention your requirements during booking."
    },
    {
      question: "How soon will we see results?",
      answer: "While spiritual benefits begin immediately, noticeable changes may take some time depending on individual circumstances and faith. Many devotees report positive changes within weeks."
    },
    {
      question: "Is there any preparation required from our side?",
      answer: "Minimal preparation is needed. We recommend taking a bath before the puja, wearing clean clothes, and maintaining a peaceful environment. Specific instructions will be provided."
    }
  ];

  const applyFAQTemplate = (faq: any) => {
    const newId = faqs.length > 0 ? Math.max(...faqs.map(item => item.id)) + 1 : 1;
    setFaqs([...faqs, {
      id: newId,
      question: faq.question,
      answer: faq.answer
    }]);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Address common questions to help devotees make informed decisions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {showTemplates ? 'Hide Templates' : 'Show Common FAQs'}
          </button>
          <button
            type="button"
            onClick={() => addItem(faqs, setFaqs, { 
              question: '', 
              answer: '' 
            })}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* Common FAQ Templates */}
      {showTemplates && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Common FAQ Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonFAQs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => applyFAQTemplate(faq)}>
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                    <div className="mt-3 text-sm text-red-600 font-medium">Click to add</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* FAQ Header */}
            <div className="bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-red-600">Q{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question *
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateItem(faqs, setFaqs, faq.id, 'question', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none font-medium"
                        placeholder="Enter the question..."
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(faqs, setFaqs, faq.id)}
                    disabled={faqs.length <= 1}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            {(expandedFAQ === faq.id || !faq.question) && (
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer *
                  <span className="text-xs text-gray-500 ml-2">(Provide detailed, helpful response)</span>
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateItem(faqs, setFaqs, faq.id, 'answer', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-h-[120px]"
                  placeholder="Provide a clear, detailed answer to the question..."
                  required
                />
                
                {/* Answer Tips */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Tips for good answers:</span>
                    <ul className="mt-1 space-y-1">
                      <li>• Be clear and concise</li>
                      <li>• Address the question directly</li>
                      <li>• Include practical information</li>
                      <li>• Keep it helpful and positive</li>
                    </ul>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">Common elements to include:</span>
                    <ul className="mt-1 space-y-1">
                      <li>• Duration/timing details</li>
                      <li>• Material requirements</li>
                      <li>• Preparation needed</li>
                      <li>• Benefits/outcomes</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Categories */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">FAQ Categories to Cover</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { category: 'Booking Process', count: 2, icon: '📅' },
            { category: 'Puja Details', count: 3, icon: '🕯️' },
            { category: 'Materials & Preparation', count: 2, icon: '🎁' },
            { category: 'Results & Benefits', count: 2, icon: '✨' },
            { category: 'Cancellation & Refunds', count: 1, icon: '↩️' },
            { category: 'Customization', count: 1, icon: '⚙️' },
            { category: 'Technical Support', count: 1, icon: '💻' },
            { category: 'Follow-up & Support', count: 1, icon: '📞' },
          ].map((cat, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-medium text-gray-800">{cat.category}</div>
              <div className="text-xs text-gray-500 mt-1">~{cat.count} questions recommended</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsTab;