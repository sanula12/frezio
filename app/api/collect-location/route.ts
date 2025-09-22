import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, ...data } = body;

    if (method === "fetch") {
      // 📥 Return all rows
      const { data: rows, error } = await supabaseServer
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

      return Response.json({ ok: true, data: rows ?? [] });
    } else {
      // 📝 Save a new row
      const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

      const { error } = await supabaseServer.from("locations").insert([
        {
          ip,
          lat: data.lat,
          lon: data.lon,
          accuracy_m: data.accuracy_m,
          timestamp: data.timestamp,
        },
      ]);

      if (error) {
        console.error("Supabase insert error:", error);
        return Response.json({ ok: false, error }, { status: 500 });
      }

      return Response.json({ ok: true });
    }
 } catch (err: unknown) {
  console.error("Unexpected error in GET:", err);
  return Response.json(
    {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
      data: [],
    },
    { status: 500 }
  );
}
}
