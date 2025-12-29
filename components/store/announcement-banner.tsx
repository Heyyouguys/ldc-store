"use client";

import { useState } from "react";
import { X, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
}

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export function AnnouncementBanner({ announcements }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!announcements.length || !isVisible) {
    return null;
  }

  const current = announcements[currentIndex];

  return (
    <div className="relative bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 text-white">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2.5">
        <div className="flex items-center gap-3 overflow-hidden">
          <Megaphone className="h-4 w-4 flex-shrink-0" />
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-medium whitespace-nowrap">{current.title}:</span>
            <span className="truncate text-sm text-violet-100">{current.content}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {announcements.length > 1 && (
            <div className="flex items-center gap-1">
              {announcements.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    idx === currentIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
          <button
            onClick={() => setIsVisible(false)}
            className="ml-2 rounded p-1 transition-colors hover:bg-white/20"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

