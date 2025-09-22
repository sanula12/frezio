import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("locations")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error.message);
      return Response.json(
        { ok: false, error: error.message, data: [] },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, data: data ?? [] });
  } catch (err: any) {
    console.error("Unexpected error in GET:", err);
    return Response.json(
      { ok: false, error: err.message, data: [] },
      { status: 500 }
    );
  }
}
