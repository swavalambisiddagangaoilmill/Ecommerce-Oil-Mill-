// Renders the AnnouncementBar layout element.
import { announcementMessages } from "../../data/siteData.js";

export default function AnnouncementBar() {
  const messages = [...announcementMessages, ...announcementMessages, ...announcementMessages];
  return (
    <div className="h-8 overflow-hidden bg-clay text-white md:h-9">
      <div className="marquee-track flex h-full w-max items-center gap-8 whitespace-nowrap hover:[animation-play-state:paused]">
        {messages.map((message, index) => (
          <span key={`${message}-${index}`} className="flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em]">
            {message}
            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          </span>
        ))}
      </div>
    </div>
  );
}


