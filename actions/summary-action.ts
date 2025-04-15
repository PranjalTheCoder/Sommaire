"use server";

import { getDbConnection } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSummaryAction({ summaryId }: { summaryId: string }) {
  try {
    const user = await currentUser();
    const userId = user?.id;
    if (!userId) {
      throw new Error("User not found");
    }
    const sql = await getDbConnection();
    //delete from database
    const result = await sql`
                DELETE FROM pdf_summaries
                WHERE id=${summaryId} AND user_id={userId}
                RETURNING id
            `;
    //revalidate path
    if (result.length > 0) {
      revalidatePath("/dashboard");
      return;
    }
    return {
      success: false,
    };
  } catch (error) {
    console.log("Error Deleting Summary", error);
    return {
      success: false,
    };
  }
}
