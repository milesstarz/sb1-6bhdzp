import React, { useCallback, useMemo } from 'react';
import { ContentItem } from './types';
import ContentGrid from './components/ContentGrid';
import SearchBar from './components/SearchBar';
import { PlusCircle } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [items, setItems] = useLocalStorage<ContentItem[]>('content-vault-items', []);
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('content-vault-search', '');

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    let content = '';
    let type: ContentItem['type'] = 'text';

    if (clipboardData.types.includes('text/html')) {
      content = clipboardData.getData('text/html');
      type = 'article';
    } else if (clipboardData.types.includes('text/uri-list')) {
      content = clipboardData.getData('text/uri-list');
      type = 'link';
    } else if (clipboardData.types.includes('image/png') || clipboardData.types.includes('image/jpeg')) {
      const file = clipboardData.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            const newItem: ContentItem = {
              id: crypto.randomUUID(),
              type: 'image',
              content: e.target.result,
              tags: [],
              createdAt: new Date(),
            };
            setItems((prev) => [newItem, ...prev]);
          }
        };
        reader.readAsDataURL(file);
        return;
      }
    } else {
      content = clipboardData.getData('text/plain');
    }

    if (content) {
      const newItem: ContentItem = {
        id: crypto.randomUUID(),
        type,
        content,
        tags: [],
        createdAt: new Date(),
      };
      setItems((prev) => [newItem, ...prev]);
    }
  }, [setItems]);

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const contentMatch = item.content.toLowerCase().includes(query);
      const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(query));
      const typeMatch = item.type.toLowerCase().includes(query);
      
      return contentMatch || tagsMatch || typeMatch;
    });
  }, [items, searchQuery]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all items?')) {
      setItems([]);
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1e2124' }}>
      <header className="bg-white shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            <img
              src="https://i.imgur.com/yRn4Zb9.png"
              alt="Atlas Logo"
              className="h-12 w-auto"
            />
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear All
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Content
              </button>
            </div>
            <div className="w-full max-w-md">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContentGrid items={filteredItems} onRemove={handleRemove} />
      </main>
    </div>
  );
}

export default App;