import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getNotifications, markNotificationRead } from "@/lib/db/queries";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const data = await getNotifications({ userId: session.user.id });
  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.id !== "string" || body.id.length > 100) {
    return NextResponse.json(
      { error: "Invalid notification" },
      { status: 400 },
    );
  }

  await markNotificationRead({
    userId: session.user.id,
    notificationId: body.id,
  });
  return NextResponse.json({ ok: true });
}
