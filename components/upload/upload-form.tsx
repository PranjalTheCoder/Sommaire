"use client";
import { z } from "zod";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import {
  generatePdfSummary,
  storePdfSummaryAction,
} from "@/actions/upload-actions";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
    onUploadBegin: (data) => {
      console.log("upload has begun for", data);
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
      const uploadResponse = await startUpload([file]);
      if (!uploadResponse || uploadResponse.length === 0) {
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
      const uploadFileUrl = uploadResponse[0].serverData.fileUrl;
      const result = await generatePdfSummary({
        fileUrl: uploadFileUrl,
        fileName: file.name,
      });

      const { data = null, message = null } = result || {};

      if (data) {
        let storeResult: any;
        toast("📑 Saving PDF", {
          description: "Hang tight! We are Saving your Summary! 💫",
        });

        if (data.summary) {
          //save the summary to the database
          storeResult = await storePdfSummaryAction({
            summary: data.summary,
            fileUrl: uploadFileUrl,
            title: data.title,
            fileName: file.name,
          });
          toast("🤩 Summary Generated", {
            description:
              "Your PDF has been Successfully summarized and saved! 💫",
          });
          formRef.current?.reset();
          // Step 6: redirect summary to the user
          router.push(`/summaries/${storeResult.data.id}`);
        }
      }
      //Step 4----
      //summarize3 the pdf using AI

      //Step 5----
      //save the summary to the database

      //Step 6----
      //redirect to the [id] summary page
    } catch (error) {
      setIsLoading(false);
      // console.error("Error Occurred", error);
      formRef.current?.reset();
    } finally {
      setIsLoading(false);
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
