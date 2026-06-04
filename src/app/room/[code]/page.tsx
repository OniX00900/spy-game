import { RoomPageClient } from "@/components/room/room-page-client";

export default async function RoomPage({
  params,
}: {
  params: Promise<{
    code: string;
  }>;
}) {
  const { code } = await params;

  return (
    <RoomPageClient
      roomCode={code}
    />
  );
}