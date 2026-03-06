import { useEffect, useState, useCallback } from 'react';
import { getPrompts } from '@/lib/prompts';
import { PromptCard } from '@/components/PromptCard';
import { PromptDialog } from '@/components/PromptDialog';
import { CreatePromptDialog } from '@/components/CreatePromptDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2 } from 'lucide-react';
import { CATEGORIES, type Prompt } from '@/types';

export function LibraryPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewPrompt, setViewPrompt] = useState<Prompt | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPrompts(
        selectedCategory ? { category: selectedCategory } : undefined
      );
      setPrompts(data.filter((p) => p.status === 'active'));
    } catch (err) {
      console.error('Failed to load prompts:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Prompt Library</h1>
          <p className="text-sm text-gray-500 mt-1">Browse and copy AI prompts</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-1.5 h-4 w-4" />
          New Prompt
        </Button>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Badge
          variant={selectedCategory === null ? 'default' : 'outline'}
          className={`cursor-pointer shrink-0 ${
            selectedCategory === null ? 'bg-indigo-600' : 'border-[#333] text-gray-400 hover:text-white'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Badge>
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            className={`cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? ''
                : 'border-[#333] text-gray-400 hover:text-white'
            }`}
            style={
              selectedCategory === cat.id
                ? { backgroundColor: cat.color, color: 'white' }
                : undefined
            }
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No prompts yet. Create the first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onView={setViewPrompt} />
          ))}
        </div>
      )}

      <PromptDialog prompt={viewPrompt} open={!!viewPrompt} onClose={() => setViewPrompt(null)} />
      <CreatePromptDialog open={showCreate} onClose={() => setShowCreate(false)} onCreated={loadPrompts} />
    </div>
  );
}
