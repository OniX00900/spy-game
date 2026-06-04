import { supabase } from "./supabase";

export async function getRoomById(
  roomId: string
) {
  const { data } =
    await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

  return data;
}