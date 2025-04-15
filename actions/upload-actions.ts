"use server";

import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/gemini";
import { fetchANdExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface PdfSummary {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    },
  ]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File Upload failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];
  if (!pdfUrl) {
    return {
      success: false,
      message: "File Upload failed",
      data: null,
    };
  }
  try {
    const pdfText = await fetchANdExtractPdfText(pdfUrl);
    console.log({ pdfText });

    let summary;
    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log({ summary });
    } catch (error) {
      console.log(error);
      //call gemini-AI
      if (error instanceof Error && error.message === "RATE_LIMIT_EXCEEDED") {
        try {
          summary = await generateSummaryFromOpenAI(pdfText);
        } catch (geminiError) {
          console.log(
            "Gemini API failed after OPENAI quote exceeded",
            geminiError
          );
          throw new Error(
            "Failed to generate summary with available AI providers"
          );
        }
      }
    }
    if (!summary) {
      return {
        success: false,
        message: "File to generate SUmmary",
        data: null,
      };
    }

    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Summary generated successfully",
      data: {
        title: fileName,
        summary,
      },
    };
  } catch (err) {
    return {
      success: false,
      message: "File Upload failed",
      data: null,
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummary) {
  //sql inserting pdf summary
  try {
    const sql = await getDbConnection();
    const [savedSummary] = await sql`
        INSERT INTO pdf_summaries (
          user_id,
          original_file_url,
          summary_text,
          title,
          file_name
        ) VALUES (
          ${userId},
          ${fileUrl},
          ${summary},
          ${title},
          ${fileName}
    ) RETURNING id, summary_text`;
    return savedSummary;
  } catch (error) {
    console.log("Error saving PDF Summary", error);
    throw error;
  }
}

export async function storePdfSUmmaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummary) {
  //user is Logged in and has a userId
  //savePdf Summary
  //savePdfSUmmary()
  let savedSummary: any;
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "User not found",
      };
    }
    savedSummary = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    if (!savedSummary) {
      return {
        success: false,
        message: "Failed to save PDF summary, please try again!",
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error Saving PDF Summary",
    };
  }
  //Step 6: Revalidate our cache
  revalidatePath(`/summaries/${savedSummary.id}`);
  return {
    success: true,
    message: "PDF Summary saved Successfully",
    data: {
      id: savedSummary.id,
    },
  };
}
