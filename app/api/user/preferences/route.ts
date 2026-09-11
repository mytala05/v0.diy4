import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getUserPreferences, upsertUserPreferences } from "@/lib/db/queries";
import { isDesignStyle, isFontFamily } from "@/lib/design-system";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const preferences = await getUserPreferences({ userId: session.user.id });
  return NextResponse.json({ data: preferences });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  if (
    typeof body?.notificationsEnabled !== "boolean" ||
    typeof body?.updatesEnabled !== "boolean" ||
    (body.locale !== undefined && !["ar", "en"].includes(body.locale)) ||
    (body.style !== undefined && !isDesignStyle(body.style)) ||
    (body.fontFamily !== undefined && !isFontFamily(body.fontFamily))
  ) {
    return NextResponse.json({ error: "Invalid preferences" }, { status: 400 });
  }

  const preferences = await upsertUserPreferences({
    userId: session.user.id,
    notificationsEnabled: body.notificationsEnabled,
    updatesEnabled: body.updatesEnabled,
    locale: body.locale,
    style: body.style,
    fontFamily: body.fontFamily,
  });

  return NextResponse.json({ data: preferences });
}
