import { Button } from "../ui/button";

export default function UploadForm() {
  return (
    <div>
      <form className="flex flex-col gap-6">
        <input type="file" />
        <Button
          variant={"link"}
          className="text-white mt-6 text-base sm:text-lg ls:text-xl
                rounded-full px-8 sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8
                lg:mt-16 bg-linear-to-r from-slate-900 to-rose-500
                hover:from-rose-500 hover:to-slate-900 hover:no-underline
                font-bold shadow-lg transition-all duration-300"
        >
          Upload Your PDF
        </Button>
      </form>
    </div>
  );
}
