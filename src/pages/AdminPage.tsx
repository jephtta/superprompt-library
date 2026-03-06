import { useEffect, useState, useCallback } from 'react';
import { getPrompts, updatePrompt, deletePrompt, syncPromptsToAlgolia } from '@/lib/prompts';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Trash2, RefreshCw, Loader2, ShieldCheck } from 'lucide-react';
import { CATEGORIES, type Prompt } from '@/types';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Navigate } from 'react-router-dom';

export function AdminPage() {
  const { isAdmin } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPrompts();
      setPrompts(data);
    } catch {
      toast.error('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  if (!isAdmin) return <Navigate to="/" replace />;

  const pendingPrompts = prompts.filter((p) => p.status === 'pending_review');
  const activePrompts = prompts.filter((p) => p.status === 'active');
  const suppressedPrompts = prompts.filter((p) => p.status === 'suppressed');

  const handleApprove = async (prompt: Prompt) => {
    await updatePrompt(prompt.id, { status: 'active' });
    toast.success('Prompt approved');
    loadPrompts();
  };

  const handleSuppress = async (prompt: Prompt) => {
    await updatePrompt(prompt.id, { status: 'suppressed', suppressedManually: true });
    toast.success('Prompt suppressed');
    loadPrompts();
  };

  const handleDelete = async (prompt: Prompt) => {
    await deletePrompt(prompt.id);
    toast.success('Prompt deleted');
    loadPrompts();
  };

  const handleCategoryChange = async (prompt: Prompt, category: string) => {
    await updatePrompt(prompt.id, { category });
    toast.success('Category updated');
    loadPrompts();
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const count = await syncPromptsToAlgolia();
      toast.info(`Sync complete. ${count} prompts processed. (Stub: Google Docs API not available)`);
    } catch {
      toast.error('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const PromptRow = ({ prompt, showActions = true }: { prompt: Prompt; showActions?: boolean }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#222] last:border-0">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm text-white truncate">{prompt.title}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{prompt.content.slice(0, 100)}...</p>
        <div className="flex items-center gap-2 mt-1">
          <Select
            value={prompt.category}
            onValueChange={(val) => handleCategoryChange(prompt, val)}
          >
            <SelectTrigger className="h-6 w-28 text-[10px] bg-transparent border-[#333] text-gray-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111] border-[#222] text-white">
              {CATEGORIES.map((c) => (
                <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-[10px] text-gray-600">
            {formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}
          </span>
        </div>
      </div>
      {showActions && (
        <div className="flex items-center gap-1">
          {prompt.status === 'pending_review' && (
            <Button variant="ghost" size="sm" onClick={() => handleApprove(prompt)} aria-label="Approve prompt" className="h-7 w-7 p-0 text-green-500 hover:text-green-400">
              <Check className="h-4 w-4" />
            </Button>
          )}
          {prompt.status !== 'suppressed' && (
            <Button variant="ghost" size="sm" onClick={() => handleSuppress(prompt)} aria-label="Suppress prompt" className="h-7 w-7 p-0 text-yellow-500 hover:text-yellow-400">
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleDelete(prompt)} aria-label="Delete prompt" className="h-7 w-7 p-0 text-red-500 hover:text-red-400">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-500" />
          <h1 className="text-xl font-bold text-white">Admin</h1>
        </div>
        <Button onClick={handleSync} disabled={syncing} variant="outline" className="border-[#333] text-gray-400 hover:text-white">
          <RefreshCw className={`mr-1.5 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from Docs'}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        </div>
      ) : (
        <Tabs defaultValue="review" className="w-full">
          <TabsList className="bg-[#111] border border-[#222]">
            <TabsTrigger value="review" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Review Queue
              {pendingPrompts.length > 0 && (
                <Badge className="ml-1.5 bg-yellow-500 text-black text-[10px] h-4 px-1">{pendingPrompts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Active ({activePrompts.length})
            </TabsTrigger>
            <TabsTrigger value="suppressed" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              Suppressed ({suppressedPrompts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="review">
            <Card className="border-[#222] bg-[#111]">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Prompts awaiting review</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingPrompts.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-8">No prompts to review</p>
                ) : (
                  pendingPrompts.map((p) => <PromptRow key={p.id} prompt={p} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card className="border-[#222] bg-[#111]">
              <CardContent className="pt-6">
                {activePrompts.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-8">No active prompts</p>
                ) : (
                  activePrompts.map((p) => <PromptRow key={p.id} prompt={p} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppressed">
            <Card className="border-[#222] bg-[#111]">
              <CardContent className="pt-6">
                {suppressedPrompts.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-8">No suppressed prompts</p>
                ) : (
                  suppressedPrompts.map((p) => <PromptRow key={p.id} prompt={p} />)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
