'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FAQProps {
  content: any;
}

function getBackgroundClass(background: string) {
  switch (background) {
    case 'gray':
      return 'bg-gray-50';
    case 'primary-light':
      return 'bg-primary-light';
    case 'secondary-light':
      return 'bg-secondary-light';
    case 'accent-light':
      return 'bg-accent-light';
    default:
      return 'bg-white';
  }
}

export default function FAQ({ content }: FAQProps) {
  const section = content.sections?.faq;
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  
  if (!section?.enabled || !section?.items?.length) {
    return null;
  }

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className={`py-20 ${getBackgroundClass(section.background || 'white')}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600">
            {section.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {section.items.map((item: any, index: number) => {
            const isOpen = openItems.has(index);
            
            return (
              <Card key={index} className="border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  <button
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => toggleItem(index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {item.question}
                    </h3>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-700 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}