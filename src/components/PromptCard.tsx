import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Eye } from 'lucide-react';
import { incrementCopyCount } from '@/lib/prompts';
import { CATEGORIES, type Prompt } from '@/types';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface PromptCardProps {
  prompt: Prompt;
  onView?: (prompt: Prompt) => void;
}

export function PromptCard({ prompt, onView }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

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
    <Card className="border-[#222] bg-[#111] hover:border-[#333] transition-colors group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium text-white leading-tight">
            {prompt.title}
          </CardTitle>
          <div className="flex items-center gap-1 shrink-0">
            {onView && (
              <Button variant="ghost" size="sm" onClick={() => onView(prompt)} className="h-7 w-7 p-0 text-gray-500 hover:text-white">
                <Eye className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 w-7 p-0 text-gray-500 hover:text-white">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 line-clamp-3 mb-3 font-mono">{prompt.content}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {category && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0" style={{ backgroundColor: category.color + '20', color: category.color }}>
                {category.name}
              </Badge>
            )}
            {prompt.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 border-[#333] text-gray-500">
                {tag}
              </Badge>
            ))}
          </div>
          <span className="text-[10px] text-gray-600">
            {prompt.copyCount} copies · {formatDistanceToNow(prompt.updatedAt, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
