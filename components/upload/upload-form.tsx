"use client";
import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { generatePdfSummary } from "@/actions/upload-actions";
import { useRef, useState } from "react";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must be less than 20MB"
    )
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  // const {toast} = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  //Step 2----
  //upload the file to Uploadthing
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("uploaded successfully!");
    },
    onUploadError: (err) => {
      console.error("error occurred while uploading", err);
      toast.error("Error occurred while uploading", {
        description: err.message,
      });
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begun for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const file = formData.get("file") as File;
      //validating the fields
      //Step 1---
      //schema validation WITH ZOD
      const validatedFields = schema.safeParse({ file });
      console.log(validatedFields);
      //if the validation fails, show the error message to the user
      if (!validatedFields.success) {
        toast.error("❌ Something went wrong", {
          description:
            validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid file",
        });
        setIsLoading(false);
        return;
      }

      toast("📑 Uploading PDF", {
        description: "We are Uploading your PDF! ",
      });

      //Step 2----
      //upload the file to Uploadthing
      const resp = await startUpload([file]);
      if (!resp) {
        toast.error("❌ Something went wrong", {
          description: "Please use a different file",
        });
        setIsLoading(false);
        return;
      }

      toast("📑 Processing PDF", {
        description: "Hang tight! Our AI is reading through your document! ✨",
      });

      //Step 3----
      //parse the pdf using Lang Chain
      const result = await generatePdfSummary(resp);

      const { data = null, message = null } = result || {};

      if (data) {
        toast("📑 Saving PDF", {
          description: "Hang tight! We are Saving your Summary! 💫",
        });

        if(data.summary){
        //save the summary to the database
        }
        formRef.current?.reset();
      }
      //Step 4----
      //summarize3 the pdf using AI

      //Step 5----
      //save the summary to the database

      //Step 6----
      //redirect to the [id] summary page
    } catch (error) {
      setIsLoading(false);
      console.error("Error Occurred", error);
      formRef.current?.reset();
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
