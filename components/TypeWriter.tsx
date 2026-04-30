'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypeWriterProps {
  text: string;
  highlight?: string;
  startDelay?: number;
  speed?: number;
  className?: string;
  trigger?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function TypeWriter({
  text,
  highlight,
  startDelay = 0,
  speed = 35,
  className = '',
  trigger = true,
  as: Tag = 'h2',
}: TypeWriterProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [started, setStarted] = useState(false);
  const totalChars = text.length;

  useEffect(() => {
    if (!trigger) return;
    const timeout = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(timeout);
  }, [trigger, startDelay]);

  useEffect(() => {
    if (!started || displayCount >= totalChars) return;
    const timeout = setTimeout(() => setDisplayCount((c) => c + 1), speed);
    return () => clearTimeout(timeout);
  }, [started, displayCount, totalChars, speed]);

  const renderText = () => {
    const shown = text.slice(0, displayCount);

    if (!highlight) {
      return (
        <>
          {shown}
          {displayCount < totalChars && <Cursor />}
        </>
      );
    }

    const highlightStart = text.indexOf(highlight);
    if (highlightStart === -1) {
      return (
        <>
          {shown}
          {displayCount < totalChars && <Cursor />}
        </>
      );
    }

    const highlightEnd = highlightStart + highlight.length;
    const shownBefore = shown.slice(0, Math.min(displayCount, highlightStart));
    const shownHighlight = displayCount > highlightStart
      ? shown.slice(highlightStart, Math.min(displayCount, highlightEnd))
      : '';
    const shownAfter = displayCount > highlightEnd ? shown.slice(highlightEnd) : '';

    return (
      <>
        {shownBefore}
        {shownHighlight && <span className="text-gradient">{shownHighlight}</span>}
        {shownAfter}
        {displayCount < totalChars && <Cursor />}
      </>
    );
  };

  return <Tag className={className}>{renderText()}</Tag>;
}

function Cursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      className="inline-block w-[2px] h-[0.85em] bg-primary ml-0.5 align-middle"
    />
  );
}
