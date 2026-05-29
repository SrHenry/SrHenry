"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  autoScroll?: boolean;
  infiniteScroll?: boolean;
  autoScrollSpeed?: number;
  dir?: "ltr" | "rtl";
}

const RESUME_DELAY = 2000;
const FRAME_SCALE = 0.06;

function stepInfinite(el: HTMLDivElement, speed: number, direction: 1 | -1, delta: number) {
  el.scrollLeft += direction * speed * delta * FRAME_SCALE;
  const singleSet = el.scrollWidth / 3;
  if (direction > 0 && el.scrollLeft >= singleSet * 2) {
    el.scrollLeft -= singleSet;
  } else if (direction < 0 && el.scrollLeft <= 0) {
    el.scrollLeft += singleSet;
  }
}

function stepBounce(
  el: HTMLDivElement,
  speed: number,
  bounceDir: React.MutableRefObject<1 | -1>,
  delta: number,
) {
  el.scrollLeft += bounceDir.current * speed * delta * FRAME_SCALE;
  if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
    bounceDir.current = -1;
  } else if (el.scrollLeft <= 0) {
    bounceDir.current = 1;
  }
}

export function Carousel({
  children,
  className,
  itemClassName,
  autoScroll = false,
  infiniteScroll = false,
  autoScrollSpeed = 0.5,
  dir = "ltr",
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isInteracting = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationRef = useRef<number>(0);
  const bounceDir = useRef<1 | -1>(1);

  const checkScroll = useCallback(() => {
    if (infiniteScroll) return;
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, [infiniteScroll]);

  useEffect(() => {
    if (infiniteScroll) return;
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [infiniteScroll, checkScroll]);

  const resetToMiddle = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const singleSet = el.scrollWidth / 3;
    const target = dir === "rtl" ? singleSet * 2 : singleSet;
    el.scrollLeft = target;
  }, [dir]);

  useLayoutEffect(() => {
    if (!infiniteScroll) return;
    resetToMiddle();
  }, [infiniteScroll, resetToMiddle]);

  useEffect(() => {
    if (!autoScroll && !infiniteScroll) return;
    const el = scrollRef.current;
    if (!el) return;

    const direction = dir === "rtl" ? -1 : 1;
    let lastTime = 0;

    const step = (time: number) => {
      if (!isInteracting.current && lastTime) {
        const delta = time - lastTime;
        if (infiniteScroll) {
          stepInfinite(el, autoScrollSpeed, direction, delta);
        } else {
          stepBounce(el, autoScrollSpeed, bounceDir, delta);
        }
      }
      lastTime = time;
      animationRef.current = requestAnimationFrame(step);
    };

    animationRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationRef.current);
  }, [autoScroll, infiniteScroll, autoScrollSpeed, dir]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("[data-carousel-item]")?.clientWidth ?? 300;
    const gap = 16;
    el.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  const handlePointerDown = () => {
    isInteracting.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  };

  const handlePointerUp = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      isInteracting.current = false;
    }, RESUME_DELAY);
  }, []);

  const snapClass = infiniteScroll || autoScroll ? "snap-none" : "snap-x snap-mandatory";
  const items = Children.toArray(children);
  const renderItems = infiniteScroll ? [...items, ...items, ...items] : items;
  const showArrows = !infiniteScroll && !autoScroll;

  return (
    <div className={cn("group relative", className)}>
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={cn(
          "-mx-4 flex gap-4 overflow-x-auto px-4 scroll-smooth scrollbar-none",
          snapClass,
        )}
        dir={infiniteScroll ? dir : undefined}
      >
        {renderItems.map((child, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: carousel items are position-stable visual-only wrappers with no identity
            key={i}
            data-carousel-item
            className={cn(
              "flex-shrink-0",
              !infiniteScroll && !autoScroll && "snap-start",
              itemClassName,
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {showArrows && canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {showArrows && canScrollRight && (
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 rounded-full bg-background/80 p-2 shadow-lg backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-background"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
