import { useEffect, useRef, useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

export function Emoji({ emoji }: { emoji: Doc<"emoji"> }) {
  // make the emoji bounce around the screen with a random angle and use the startX and startY
  // to determine the starting position
  const emojiRef = useRef<HTMLDivElement>(null);
  const x = useRef<number>(emoji.startX);
  const y = useRef<number>(emoji.startY);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!emojiRef.current) return;
      x.current += Math.cos(angleRef.current) * emoji.speed;
      y.current += Math.sin(angleRef.current) * emoji.speed;

      if (x.current < 0 || x.current > window.innerWidth) {
        angleRef.current = Math.PI - angleRef.current;
      }

      if (y.current < 0 || y.current > window.innerHeight) {
        angleRef.current = -angleRef.current;
      }

      emojiRef.current.style.left = `${Math.floor(x.current)}px`;
      emojiRef.current.style.top = `${Math.floor(y.current)}px`;
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="text-4xl absolute flex flex-col items-center gap-2"
      ref={emojiRef}
    >
      <div className="text-white text-xs">{emoji.name}</div>
      <div>{emoji.emoji}</div>
    </div>
  );
}
