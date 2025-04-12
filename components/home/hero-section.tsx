import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section>
      <div className="">
        {/* <Sparkles className="h-6 w-6 mr-2 text-rose-600 animate-pulse"></Sparkles> */}
        <p>Powered by AI</p>
        <h1>Transform PDFs into concise summaries</h1>
        <h2>Get a beautiful summary reel of the document in seconds.</h2>
        <Button className="btn">Try Sommaire</Button>
      </div>
    </section>
  );
}
