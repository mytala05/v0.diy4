import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { deleteChatOwnership, getChatOwnership } from "@/lib/db/queries";
import { getUserV0Client, getV0ClientErrorResponse } from "@/lib/v0-client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json().catch(() => null);
    const chatId = typeof body?.chatId === "string" ? body.chatId.trim() : "";

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (!chatId || chatId.length > 200) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 },
      );
    }

    const ownership = await getChatOwnership({ v0ChatId: chatId });
    if (!ownership || ownership.user_id !== session.user.id) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const v0Client = await getUserV0Client(session).catch((error) => {
      const response = getV0ClientErrorResponse(error);
      if (response) {
        throw response;
      }
      throw error;
    });

    const result = await v0Client.chats.delete({
      chatId,
    });
    await deleteChatOwnership({ v0ChatId: chatId });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }

    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Failed to delete chat" },
      { status: 500 },
    );
  }
}
