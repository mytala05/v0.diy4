"use client";

import { Copy, ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatMenuProps {
  chatId: string;
}

export function ChatMenu({ chatId }: ChatMenuProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDuplicateChat = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat/fork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate chat");
      }

      const result = await response.json();

      // Close dialog and navigate to the new forked chat
      setIsDuplicateDialogOpen(false);
      router.push(`/chats/${result.id}`);
    } catch (error) {
      console.error("Error duplicating chat:", error);
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChat = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      // Close dialog and navigate back to homepage
      setIsDeleteDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting chat:", error);
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">فتح قائمة المحادثة</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a
              href={`https://v0.app/chat/${chatId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              عرض على v0.app
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDuplicateDialogOpen(true)}
            disabled={isLoading}
          >
            <Copy className="mr-2 h-4 w-4" />
            نسخ المحادثة
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isLoading}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            حذف المحادثة
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* نسخ المحادثة Dialog */}
      <Dialog
        open={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>نسخ المحادثة</DialogTitle>
            <DialogDescription>
              This will create a copy of the current chat. You'll be redirected
              to the new chat once it's created.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDuplicateDialogOpen(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button onClick={handleDuplicateChat} disabled={isLoading}>
              {isLoading ? "جارٍ النسخ..." : "نسخ المحادثة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* حذف المحادثة Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المحادثة</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone and will permanently remove the chat and all its messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteChat}
              disabled={isLoading}
            >
              {isLoading ? "جارٍ الحذف..." : "حذف المحادثة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
