
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { cn } from '@/lib/utils';

type MotionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const MotionDialog: React.FC<MotionDialogProps> = ({
  open,
  onOpenChange,
  title,
  children,
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('animate-scale-in', className)}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};
