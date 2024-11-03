import React from 'react';
import { Grid } from 'lucide-react';
import { ContentItem } from '../types';
import ContentCard from './ContentCard';

interface ContentGridProps {
  items: ContentItem[];
  onRemove: (id: string) => void;
}

export default function ContentGrid({ items, onRemove }: ContentGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-white">
        <Grid className="w-16 h-16 mb-4" />
        <p className="text-xl font-medium">Paste any content to get started</p>
        <p className="text-sm mt-2">Use Ctrl+V to add links, images, or text</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          item={item}
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}