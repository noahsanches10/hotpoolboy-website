import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: any;
}

export default function BlogCard({ post }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimatedReadTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
      <div className="relative h-40">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-3 leading-relaxed flex-grow line-clamp-2">
          {post.excerpt}
        </p>
        
        <div className="text-sm text-gray-500 mb-3">
          {formatDate(post.date)}
        </div>
        
        <Link 
          href={`/blog/${post.slug}`}
          className="inline-flex items-center text-primary font-medium hover:text-primary/80 transition-colors mt-auto text-sm"
        >
          Read More
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}