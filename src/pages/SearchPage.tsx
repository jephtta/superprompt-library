import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { PromptCard } from '@/components/PromptCard';
import { PromptDialog } from '@/components/PromptDialog';
import { algoliaClient, PROMPTS_INDEX } from '@/lib/algolia';
import { getPrompts } from '@/lib/prompts';
import { Search, Loader2 } from 'lucide-react';
import type { Prompt } from '@/types';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewPrompt, setViewPrompt] = useState<Prompt | null>(null);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>([]);

  // Load all active prompts for client-side fallback search
  useEffect(() => {
    getPrompts().then((data) => setAllPrompts(data.filter((p) => p.status === 'active')));
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (algoliaClient) {
          const { hits } = await algoliaClient.searchSingleIndex<Prompt>({
            indexName: PROMPTS_INDEX,
            searchParams: { query, hitsPerPage: 20 },
          });
          setResults(hits.map((h) => ({ ...h, id: h.objectID, createdAt: new Date(h.createdAt), updatedAt: new Date(h.updatedAt) })));
        } else {
          // Fallback: client-side search
          const q = query.toLowerCase();
          setResults(
            allPrompts.filter(
              (p) =>
                p.title.toLowerCase().includes(q) ||
                p.content.toLowerCase().includes(q) ||
                p.tags.some((t) => t.toLowerCase().includes(q))
            )
          );
        }
      } catch {
        // Fallback to client-side on Algolia error
        const q = query.toLowerCase();
        setResults(
          allPrompts.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              p.content.toLowerCase().includes(q) ||
              p.tags.some((t) => t.toLowerCase().includes(q))
          )
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, allPrompts]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white mb-4">Search Prompts</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, content, or tags..."
            className="bg-[#111] border-[#222] text-white pl-10 h-11"
            autoFocus
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : query.trim() && results.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No prompts match &ldquo;{query}&rdquo;</p>
        </div>
      ) : !query.trim() ? (
        <div className="text-center py-20 text-gray-500">
          <Search className="h-10 w-10 mx-auto mb-3 text-gray-700" />
          <p>Start typing to search prompts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} onView={setViewPrompt} />
          ))}
        </div>
      )}

      <PromptDialog prompt={viewPrompt} open={!!viewPrompt} onClose={() => setViewPrompt(null)} />
    </div>
  );
}
