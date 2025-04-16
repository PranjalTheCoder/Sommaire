import BgGradient from "@/components/common/bg-gradient";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section
      className="flex justify-center
    items-center min-h-screen"
    >
      <div
        className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6
        lg:px-8 lg:pt-12"
      >
        <BgGradient className="from-rose-400 via-rose-300 to-orange-200" />
        <SignUp />
      </div>
    </section>
  );
}
