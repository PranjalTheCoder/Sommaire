import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchANdExtractPdfText(fileUrl: string) {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  
  const blob = await response.blob();

  const arrayBuffer = await blob.arrayBuffer();

  const loader = new PDFLoader(new Blob([arrayBuffer]));

  const docs = await loader.load();
    //combine all pages
  return docs.map((doc) => doc.pageContent).join("\n");
}
