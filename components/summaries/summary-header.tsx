import { Calendar, ChevronLeft, Clock, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";

export function SummaryHeader({
  title,
  createdAt,
  readingTime,
}: {
  title: string;
  createdAt: string;
  readingTime: string;
}) {
  return (
    <div className="flex gap-4 mb-4 justify-between">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Badge
            variant="secondary"
            className="relative px-4 py-1.5 text-sm font-medium
            bg-white/80 backdrop-blur-xs rounded-full hover:bg-white/90
            transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <Sparkles
              className="h-4 w-4 mr-1.5 
                    text-rose-500"
            />
            AI Summary
          </Badge>
          <div
            className="flex items-center gap-2 text-sm
          text-muted-foreground"
          >
            <Calendar className="h-4 w-4 text-rose-400" />
            {new Date(createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div
            className="flex items-center gap-2 text-sm
          text-muted-foreground"
          >
            <Clock className="h-4 w-4 text-rose-400" />
            {readingTime} min read
          </div>
          <h1
            className="text-2xl lg:text-4xl font-bold
          lg:tracking-tight"
          >
            <span
              className="bg-linear-to-r from-rose-600
            to-orange-600 bg-clip-text text-transparent"
            >
              {title}
            </span>
          </h1>
        </div>
      </div>
      <div className="self-start">
        <Link href="/dashboard">
          <Button
            variant="link"
            size="sm"
            className="group flex items-center gap-1 sm:gap-2
                hover:bg-white/80 backdrop-blur-xs rounded-full
                transition-all duration-200 shadow-xs hover:shadow-md
                border border-rose-100/30 bg-rose-100 px-2 sm:px-3"
          >
            <ChevronLeft
              className="h-3 w-3 sm:h-4 sm:w-4
                text-rose-500 transition-transform group-hover:translate-0.5"
            />
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Back <span className="hidden sm:inline">to Dashboard</span>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
