import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GalleryProps {
  content: any;
}

function getBackgroundClass(background: string) {
  switch (background) {
    case 'white':
      return 'bg-white';
    case 'primary-light':
      return 'bg-primary-light';
    case 'secondary-light':
      return 'bg-secondary-light';
    case 'accent-light':
      return 'bg-accent-light';
    default:
      return 'bg-gray-50';
  }
}

export default function Gallery({ content }: GalleryProps) {
  const section = content.sections?.gallery;
  
  if (!section?.enabled || !section?.items?.length) {
    return null;
  }

  return (
    <section className={`py-20 ${getBackgroundClass(section.background || 'gray')}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {section.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {section.items.map((item: any, index: number) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Before/After Images */}
                  <div className="grid grid-cols-2">
                    <div className="relative h-64">
                      <Image
                        src={item.beforeImage}
                        alt={`${item.title} - Before`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          Before
                        </Badge>
                      </div>
                    </div>
                    <div className="relative h-64">
                      <Image
                        src={item.afterImage}
                        alt={`${item.title} - After`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          After
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  {(item.title || item.description) && (
                    <div className="p-6">
                      {item.title && (
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                      )}
                      {item.description && (
                        <p className="text-gray-600">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}