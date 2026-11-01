'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import React, { ReactNode, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
};

const CommonCarouselWrapper = ({
  children,
  className,
  contentClassName,
  itemClassName,
  showArrows = false,
  showDots = false,
}: Props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Sync Carousel state for pagination dots
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: 'start',
        loop: false,
        dragFree: true,
      }}
      className={cn('w-full', className)}
    >
      {/* Carousel Content */}
      <CarouselContent className={cn('ml-0', contentClassName)}>
        {React.Children.map(children, (child, index) => (
          <CarouselItem
            key={index}
            className={cn('basis-auto flex-none pl-0', itemClassName)}
          >
            {child}
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Footer Navigation Bar */}
      {(showDots || showArrows) && (
        <div className='flex items-center justify-between pt-4 px-4'>
          {/* Left Side: Pagination Dots */}
          {showDots && count > 1 ? (
            <div className='flex items-center gap-1.5'>
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    'h-2 w-2 rounded-full transition-all duration-300',
                    current === index
                      ? 'w-4 bg-black'
                      : 'bg-gray-300 hover:bg-gray-400',
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          ) : (
            <div />
          )}

          {/* Right Side: Navigation Buttons */}
          {showArrows && (
            <div className='flex items-center gap-2 relative'>
              <CarouselPrevious className='static translate-y-0 translate-x-0 h-9 w-9 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-100' />
              <CarouselNext className='static translate-y-0 translate-x-0 h-9 w-9 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-100' />
            </div>
          )}
        </div>
      )}
    </Carousel>
  );
};

export default CommonCarouselWrapper;
