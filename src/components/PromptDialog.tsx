import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';
import { incrementCopyCount } from '@/lib/prompts';
import { CATEGORIES, type Prompt } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PromptDialogProps {
  prompt: Prompt | null;
  open: boolean;
  onClose: () => void;
}

export function PromptDialog({ prompt, open, onClose }: PromptDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!prompt) return null;

  const category = CATEGORIES.find((c) => c.id === prompt.category);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      await incrementCopyCount(prompt.id);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#111] border-[#222] text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{prompt.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {category && (
              <Badge style={{ backgroundColor: category.color + '20', color: category.color }}>
                {category.name}
              </Badge>
            )}
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-[#333] text-gray-400">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="rounded-lg bg-[#0a0a0a] border border-[#222] p-4">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{prompt.content}</pre>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{prompt.copyCount} copies · Updated {format(prompt.updatedAt, 'MMM d, yyyy')}</span>
            <Button onClick={handleCopy} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy Prompt'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
