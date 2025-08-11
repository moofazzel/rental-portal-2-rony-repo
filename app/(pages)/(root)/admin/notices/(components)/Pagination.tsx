// File: components/Pagination.tsx
'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, total, onPageChange }: Props) {
  const maxVisible = 5;

  const getPages = () => {
    const pages: (number | string)[] = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(total, page + 2);

    if (end - start < maxVisible - 1) {
      if (page < Math.ceil(total / 2)) {
        end = Math.min(total, start + maxVisible - 1);
      } else {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (start > 1) {
      pages.unshift('…');
      pages.unshift(1);
    }
    if (end < total) {
      pages.push('…');
      pages.push(total);
    }

    return pages;
  };

  return (
    <div className="flex justify-center space-x-1 mt-4">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        {'<'}
      </Button>

      {getPages().map((p, idx) => (
        <Button
          key={idx}
          variant={p === page ? 'default' : 'outline'}
          size="sm"
          disabled={typeof p === 'string'}
          className={cn(typeof p === 'string' && 'cursor-default')}
          onClick={() => typeof p === 'number' && onPageChange(p)}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={page === total}
        onClick={() => onPageChange(page + 1)}
      >
        {'>'}
      </Button>
    </div>
  );
}
