import React from 'react';
import { useAccordion } from './accordion-context';
import { cn } from '@/lib/utils';

type AccordionHeaderProps = {
  className?: string;
  children:
    | React.ReactNode
    | (({ open }: { open: boolean }) => React.ReactNode);
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export const AccordionHeader = React.forwardRef<
  HTMLButtonElement,
  AccordionHeaderProps
>(({ children, className, ...props }, ref) => {
  const { isOpen, toggle } = useAccordion();
  const isChildrenFunction = typeof children === 'function';

  return (
    <button
      ref={ref}
      onClick={() => toggle()}
      className={cn(
        'block w-full',
        className
      )}
      {...props}
    >
      {isChildrenFunction ? children({ open: isOpen }) : children}
    </button>
  );
});

AccordionHeader.displayName = 'AccordionHeader';