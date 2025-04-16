import { cn } from "@/lib/utils";

export default function BgGradient({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 -top-40
                -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-30"
    >
      <div
        style={{
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        }}
        className={cn(
          "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]",
          className
        )}
      />
    </div>
  );
}
