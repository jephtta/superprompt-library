import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createPrompt } from '@/lib/prompts';
import { useAuth } from '@/contexts/AuthContext';
import { CATEGORIES } from '@/types';
import { toast } from 'sonner';

interface CreatePromptDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreatePromptDialog({ open, onClose, onCreated }: CreatePromptDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      await createPrompt({
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        status: 'active',
        suppressedManually: false,
        createdBy: user.uid,
      });
      toast.success('Prompt created');
      setTitle('');
      setContent('');
      setCategory('general');
      setTags('');
      onCreated();
      onClose();
    } catch {
      toast.error('Failed to create prompt');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-[#222] text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Prompt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-gray-400">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Code Review Prompt"
              className="bg-[#0a0a0a] border-[#222] text-white mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="content" className="text-gray-400">Prompt Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the prompt text..."
              rows={6}
              className="bg-[#0a0a0a] border-[#222] text-white font-mono text-sm mt-1"
              required
            />
          </div>
          <div>
            <Label htmlFor="category" className="text-gray-400">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-[#0a0a0a] border-[#222] text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-[#222] text-white">
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tags" className="text-gray-400">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. review, code, quality"
              className="bg-[#0a0a0a] border-[#222] text-white mt-1"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-gray-400">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700">
              {submitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
