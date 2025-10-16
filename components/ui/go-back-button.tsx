'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from './button';

interface GoBackButtonProps {
  to?: string;
  className?: string;
  children?: React.ReactNode;
}

export function GoBackButton({ to, className, children }: GoBackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (to) {
      router.push(to);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={`text-slate-600 hover:text-slate-800 ${className}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {children || 'Go Back'}
    </Button>
  );
}