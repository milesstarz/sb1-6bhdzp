import React, { useState } from 'react';
import { Trash2, Link, FileText, Image, File } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onRemove: () => void;
}

export default function ContentCard({ item, onRemove }: ContentCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRemove = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    onRemove();
  };

  const getIcon = () => {
    switch (item.type) {
      case 'link':
        return <Link className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleRemove}
          className={`p-2 rounded-full ${
            showConfirm
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600'
          } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          {getIcon()}
          <span className="text-xs font-medium text-gray-500">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </span>
        </div>

        {item.type === 'image' ? (
          <img
            src={item.content}
            alt="Content preview"
            className="w-full h-32 object-cover rounded-md"
          />
        ) : (
          <div className="h-32 overflow-hidden">
            <p className="text-gray-800 text-sm">{item.content}</p>
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}