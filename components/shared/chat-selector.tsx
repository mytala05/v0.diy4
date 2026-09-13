"use client";

import {
  Copy,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import useSWR from "swr";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDictionary } from "@/lib/i18n";

interface Chat {
  id: string;
  name?: string;
  privacy?: "public" | "private" | "team" | "team-edit" | "unlisted";
  createdAt: string;
  url?: string;
}

type PrivacyType = "public" | "private" | "team" | "team-edit" | "unlisted";

const getChatDisplayName = (chat: Chat): string =>
  chat.name || `محادثة ${chat.id.slice(0, 8)}...`;

const privacyConfig: Record<
  PrivacyType,
  { icon: typeof Eye; label: string; description: string }
> = {
  public: {
    icon: Eye,
    label: "عامة",
    description: "يمكن لأي شخص رؤية هذه المحادثة",
  },
  private: {
    icon: EyeOff,
    label: "خاصة",
    description: "يمكنك أنت فقط رؤية هذه المحادثة",
  },
  team: {
    icon: Users,
    label: "الفريق",
    description: "يمكن لأعضاء الفريق رؤية هذه المحادثة",
  },
  "team-edit": {
    icon: Users,
    label: "تحرير الفريق",
    description: "يمكن لأعضاء الفريق رؤية هذه المحادثة وتحريرها",
  },
  unlisted: {
    icon: Lock,
    label: "غير مدرجة",
    description: "يمكن لمن يملك الرابط فقط رؤية هذه المحادثة",
  },
};

const getPrivacyIcon = (privacy: string) => {
  const config = privacyConfig[privacy as PrivacyType] || privacyConfig.private;
  const Icon = config.icon;
  return <Icon className="h-4 w-4" />;
};

const getPrivacyDisplayName = (privacy: string) =>
  privacyConfig[privacy as PrivacyType]?.label || "خاصة";

const fetcher = async (url: string): Promise<Chat[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch chats");
  }
  const data = await response.json();
  return data.data || [];
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This coordinator intentionally owns the chat menu actions and dialogs.
export function ChatSelector() {
  const router = useRouter();
  const t = getDictionary("ar");
  const pathname = usePathname();
  const { data: session } = useSession();
  const {
    data: chats = [],
    error: chatsError,
    isLoading: isChatsLoading,
    mutate: mutateChats,
  } = useSWR<Chat[]>(session?.user?.id ? "/api/chats" : null, fetcher);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isVisibilityDialogOpen, setIsVisibilityDialogOpen] = useState(false);
  const [renameChatName, setRenameChatName] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState<
    "public" | "private" | "team" | "team-edit" | "unlisted"
  >("private");
  const [isRenamingChat, setIsRenamingChat] = useState(false);
  const [isDeletingChat, setIsDeletingChat] = useState(false);
  const [isDuplicatingChat, setIsDuplicatingChat] = useState(false);
  const [isChangingVisibility, setIsChangingVisibility] = useState(false);

  // Get current chat ID if on a chat page
  const currentChatId = pathname?.startsWith("/chats/")
    ? pathname.split("/")[2]
    : null;

  const handleValueChange = useCallback(
    (chatId: string) => router.push(`/chats/${chatId}`),
    [router],
  );

  const handleRenameChat = useCallback(async () => {
    if (!(renameChatName.trim() && currentChatId)) {
      return;
    }

    setIsRenamingChat(true);
    try {
      const response = await fetch(`/api/chats/${currentChatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameChatName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename chat");
      }

      const updatedChat = await response.json();
      await mutateChats(
        (currentChats = []) =>
          currentChats.map((c) =>
            c.id === currentChatId ? { ...c, name: updatedChat.name } : c,
          ),
        { revalidate: false },
      );
      setIsRenameDialogOpen(false);
      setRenameChatName("");
    } catch (error) {
      console.error("Error renaming chat:", error);
    } finally {
      setIsRenamingChat(false);
    }
  }, [renameChatName, currentChatId, mutateChats]);

  const handleDeleteChat = useCallback(async () => {
    if (!currentChatId) {
      return;
    }

    setIsDeletingChat(true);
    try {
      const response = await fetch(`/api/chats/${currentChatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      await mutateChats(
        (currentChats = []) =>
          currentChats.filter((c) => c.id !== currentChatId),
        { revalidate: false },
      );
      setIsDeleteDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeletingChat(false);
    }
  }, [currentChatId, router, mutateChats]);

  const handleDuplicateChat = useCallback(async () => {
    if (!currentChatId) {
      return;
    }

    setIsDuplicatingChat(true);
    try {
      const response = await fetch("/api/chat/fork", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: currentChatId }),
      });

      if (!response.ok) {
        throw new Error("Failed to duplicate chat");
      }

      const result = await response.json();
      setIsDuplicateDialogOpen(false);
      router.push(`/chats/${result.id}`);
    } catch (error) {
      console.error("Error duplicating chat:", error);
    } finally {
      setIsDuplicatingChat(false);
    }
  }, [currentChatId, router]);

  const handleChangeVisibility = useCallback(async () => {
    if (!currentChatId) {
      return;
    }

    setIsChangingVisibility(true);
    try {
      const response = await fetch(`/api/chats/${currentChatId}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privacy: selectedVisibility }),
      });

      if (!response.ok) {
        throw new Error("Failed to change chat visibility");
      }

      const updatedChat = await response.json();
      await mutateChats(
        (currentChats = []) =>
          currentChats.map((c) =>
            c.id === currentChatId ? { ...c, privacy: updatedChat.privacy } : c,
          ),
        { revalidate: false },
      );
      setIsVisibilityDialogOpen(false);
    } catch (error) {
      console.error("Error changing chat visibility:", error);
    } finally {
      setIsChangingVisibility(false);
    }
  }, [currentChatId, selectedVisibility, mutateChats]);

  const isAnyActionPending =
    isRenamingChat ||
    isDeletingChat ||
    isDuplicatingChat ||
    isChangingVisibility;

  // Don't show if user is not authenticated
  if (!session?.user?.id) {
    return null;
  }

  const currentChat = currentChatId
    ? chats.find((c) => c.id === currentChatId)
    : null;

  return (
    <>
      <div className="flex items-center gap-1">
        <Select value={currentChatId || ""} onValueChange={handleValueChange}>
          <SelectTrigger className="w-fit min-w-37.5 max-w-62.5" size="sm">
            <SelectValue placeholder="اختر محادثة">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">
                  {currentChat
                    ? getChatDisplayName(currentChat)
                    : "Select chat"}
                </span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {isChatsLoading ? (
              <div className="px-2 py-1.5 text-muted-foreground text-sm">
                {t.loadingChats}
              </div>
            ) : chatsError ? (
              <div className="px-2 py-1.5 text-destructive text-sm">
                {t.errorLoadingChats}
              </div>
            ) : chats.length > 0 ? (
              chats.slice(0, 15).map((chat) => (
                <SelectItem key={chat.id} value={chat.id}>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="truncate">{getChatDisplayName(chat)}</span>
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-1.5 text-muted-foreground text-sm">
                {t.noChatsYet}
              </div>
            )}
          </SelectContent>
        </Select>

        {/* Chat Context Menu */}
        {currentChat && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={isAnyActionPending}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">خيارات المحادثة</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a
                  href={`https://v0.app/chat/${currentChatId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="me-2 h-4 w-4" />
                  عرض على v0.app
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDuplicateDialogOpen(true)}
                disabled={isAnyActionPending}
              >
                <Copy className="me-2 h-4 w-4" />
                نسخ المحادثة
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedVisibility(currentChat.privacy || "private");
                  setIsVisibilityDialogOpen(true);
                }}
                disabled={isAnyActionPending}
              >
                {getPrivacyIcon(currentChat.privacy || "private")}
                <span className="ms-2">تغيير الخصوصية</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setRenameChatName(currentChat.name || "");
                  setIsRenameDialogOpen(true);
                }}
                disabled={isAnyActionPending}
              >
                <Edit2 className="me-2 h-4 w-4" />
                إعادة تسمية المحادثة
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isAnyActionPending}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="me-2 h-4 w-4" />
                حذف المحادثة
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* إعادة تسمية المحادثة Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إعادة تسمية المحادثة</DialogTitle>
            <DialogDescription>
              أدخل اسمًا جديدًا لهذه المحادثة.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="اسم المحادثة"
              value={renameChatName}
              onChange={(e) => setRenameChatName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isRenamingChat) {
                  handleRenameChat();
                }
              }}
              disabled={isRenamingChat}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRenameDialogOpen(false);
                setRenameChatName("");
              }}
              disabled={isRenamingChat}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameChat}
              disabled={isRenamingChat || !renameChatName.trim()}
            >
              {isRenamingChat ? "جارٍ إعادة التسمية..." : "إعادة تسمية المحادثة"}
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
              disabled={isDeletingChat}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteChat}
              disabled={isDeletingChat}
            >
              {isDeletingChat ? "جارٍ الحذف..." : "حذف المحادثة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              disabled={isDuplicatingChat}
            >
              Cancel
            </Button>
            <Button onClick={handleDuplicateChat} disabled={isDuplicatingChat}>
              {isDuplicatingChat ? "جارٍ النسخ..." : "نسخ المحادثة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* تغيير الخصوصية Dialog */}
      <Dialog
        open={isVisibilityDialogOpen}
        onOpenChange={setIsVisibilityDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغيير خصوصية المحادثة</DialogTitle>
            <DialogDescription>
              اختر من يمكنه رؤية هذه المحادثة والوصول إليها.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedVisibility}
              onValueChange={(
                value: "public" | "private" | "team" | "team-edit" | "unlisted",
              ) => setSelectedVisibility(value)}
            >
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getPrivacyIcon(selectedVisibility)}
                    <span>{getPrivacyDisplayName(selectedVisibility)}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4" />
                    <div>
                      <div>Private</div>
                      <div className="text-muted-foreground text-xs">
                        Only you can see this chat
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="public">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <div>
                      <div>Public</div>
                      <div className="text-muted-foreground text-xs">
                        Anyone can see this chat
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="team">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <div>
                      <div>Team</div>
                      <div className="text-muted-foreground text-xs">
                        Team members can see this chat
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="team-edit">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <div>
                      <div>Team Edit</div>
                      <div className="text-muted-foreground text-xs">
                        Team members can see and edit this chat
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="unlisted">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <div>
                      <div>Unlisted</div>
                      <div className="text-muted-foreground text-xs">
                        Only people with the link can see this chat
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsVisibilityDialogOpen(false)}
              disabled={isChangingVisibility}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeVisibility}
              disabled={isChangingVisibility}
            >
              {isChangingVisibility ? "جارٍ التغيير..." : "تغيير الخصوصية"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
