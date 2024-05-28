"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Emoji } from "./emoji";
import { useRef, useState } from "react";
import { GithubIcon } from "./icons";

export default function OtherPage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const emojis = useQuery(api.emoji.getRecentEmojis);
  const dropEmoji = useMutation(api.emoji.dropEmoji);
  const clearAll = useMutation(api.emoji.clearAll);
  const [name, setName] = useState("");

  return (
    <div
      ref={wrapperRef}
      id="wrapper"
      className="relative overflow-hidden w-full min-h-screen"
    >
      <div className="z-10 flex absolute top-1 left-1 gap-1">
        <form
          className="flex gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const name = formData.get("name") as string;
            dropEmoji({
              name,
              startX: Math.random() * window.innerWidth,
              startY: Math.random() * window.innerHeight,
            });
          }}
        >
          <input
            name="name"
            placeholder="Display Name"
            className="text-slate-900 p-2 rounded"
            title="drop an emoji"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <button
            type="submit"
            className="h-full text-black px-2 py-1 rounded bg-slate-200"
          >
            Drop Emoji 😎
          </button>
        </form>
        <button
          title="delete all"
          onClick={() => {
            clearAll();

            if (wrapperRef.current) {
              wrapperRef.current.classList.add("shake");
              setTimeout(() => {
                wrapperRef.current?.classList.remove("shake");
              }, 1000);
            }
          }}
          className="bg-red-100 text-black px-4 py-1 rounded"
        >
          💥
        </button>
      </div>
      <button className="rounded p-2 bg-slate-50 text-4xl absolute z-10 top-1 right-1">
        <GithubIcon />
      </button>

      {emojis?.map((emoji) => <Emoji key={emoji._id} emoji={emoji} />)}
    </div>
  );
}
