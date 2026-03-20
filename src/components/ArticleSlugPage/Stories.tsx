"use client";

import { useEffect, useRef, useState } from "react";
import { getStories, getStoryItems } from "@/services/storyService";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

type StoryItems = {
  _id: string;
  title: string;
  storyImage: string;
  buttonText?: string;
  buttonLink?: string;
  viewCount: number;
};

type Story = {
  _id: string;
  title: string;
  viewCount: number;
};

export default function Stories({ onOpen }: any) {
  const [stories, setStories] = useState<StoryItems[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const storyList = await getStories();
      console.log(storyList)

      if (!storyList) return;

      // Fetch items for all stories in parallel
      const storiesWithItems: StoryItems[] = await Promise.all(
        storyList.map(async (story: Story) => {
          const items = await getStoryItems(story._id);
          console.log(items)
          return {
            ...story,
            items: items || [],
          };
        }),
      );

      setStories(storiesWithItems);
    } catch (error) {
      console.error("Error loading stories:", error);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 250;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };
  return (
    <div className="relative max-w-7xl mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 border-b-2 shadow">
        <h2 className="text-red-500 font-bold text-lg tracking-wide">
          NEWS STORIES
        </h2>

        {/* ARROWS */}
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded shadow hover:bg-gray-300 transition"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded shadow hover:bg-gray-300 transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* STORIES ROW */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {stories.map((story: any) => (
          <div
            key={story._id}
            onClick={() => onOpen(story)}
            className="group cursor-pointer min-w-[110px]"
          >
            {/* GRADIENT BORDER */}
            <div className="p-[2px] rounded-2xl bg-gradient-to-tr from-red-500 via-orange-400 to-pink-500">
              <div className="w-[100px] h-[160px] rounded-2xl overflow-hidden bg-black relative shadow-md">
                <div className="relative w-[100px] h-[160px]">
                  <Image
                    src={story.storyImage}
                    alt={story.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* TITLE */}
                <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium line-clamp-2">
                  {story.title || "dgrrbbbbddf"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
