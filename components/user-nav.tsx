"use client";

import {
  FolderKanban,
  KeyRound,
  LogOut,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useV0ApiKeyModal } from "@/contexts/v0-api-key-modal-context";

interface UserNavProps {
  session: Session | null;
}

export function UserNav({ session }: UserNavProps) {
  const { openKeyModal } = useV0ApiKeyModal();
  const initials =
    session?.user?.email?.split("@")[0]?.slice(0, 2)?.toUpperCase() || "U";

  const isSignedOut = !session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {isSignedOut ? <User className="h-4 w-4" /> : initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="font-medium text-sm leading-none">
              {isSignedOut ? "غير مسجل الدخول" : "المستخدم"}
            </p>
            {session?.user?.email && (
              <p className="text-muted-foreground text-xs leading-none">
                {session.user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isSignedOut && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/projects" className="cursor-pointer">
                <FolderKanban className="me-2 h-4 w-4" />
                <span>المشاريع</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/chats" className="cursor-pointer">
                <MessageSquare className="me-2 h-4 w-4" />
                <span>المحادثات</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                openKeyModal();
              }}
              className="cursor-pointer"
            >
              <KeyRound className="me-2 h-4 w-4" />
              <span>مفتاح API</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {isSignedOut && (
          <>
            <DropdownMenuItem asChild>
              <a href="/register" className="cursor-pointer">
                <span>إنشاء حساب</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/login" className="cursor-pointer">
                <span>تسجيل الدخول</span>
              </a>
            </DropdownMenuItem>
          </>
        )}
        {!isSignedOut && (
          <DropdownMenuItem
            onClick={async () => {
              // Clear any local session data first
              await signOut({ callbackUrl: "/", redirect: true });
            }}
            className="cursor-pointer"
          >
            <LogOut className="me-2 h-4 w-4" />
            <span>تسجيل الخروج</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
