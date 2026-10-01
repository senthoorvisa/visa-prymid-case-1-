"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  demoClients,
  demoCommunityPosts,
  demoNotifications,
  type DemoClient,
  type DemoCommunityPost,
  type DemoCommunityReply,
  type DemoNotification,
} from "@/lib/showcase-data";

type ShowcaseContextValue = {
  clients: DemoClient[];
  addClient: (client: DemoClient) => void;
  posts: DemoCommunityPost[];
  addPost: (post: DemoCommunityPost) => void;
  repliesByPost: Record<string, DemoCommunityReply[]>;
  addReply: (postId: string, reply: DemoCommunityReply) => void;
  notifications: DemoNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
};

const ShowcaseContext = createContext<ShowcaseContextValue | null>(null);

export function ShowcaseProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState(demoClients);
  const [posts, setPosts] = useState(demoCommunityPosts);
  const [repliesByPost, setRepliesByPost] = useState<Record<string, DemoCommunityReply[]>>({});
  const [notifications, setNotifications] = useState(demoNotifications);

  const value = useMemo<ShowcaseContextValue>(() => ({
    clients,
    addClient: (client) => setClients((items) => [client, ...items]),
    posts,
    addPost: (post) => setPosts((items) => [post, ...items]),
    repliesByPost,
    addReply: (postId, reply) => setRepliesByPost((items) => ({ ...items, [postId]: [...(items[postId] ?? []), reply] })),
    notifications,
    markNotificationRead: (id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, unread: false } : item)),
    markAllNotificationsRead: () => setNotifications((items) => items.map((item) => ({ ...item, unread: false }))),
    dismissNotification: (id) => setNotifications((items) => items.filter((item) => item.id !== id)),
  }), [clients, posts, repliesByPost, notifications]);

  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>;
}

export function useShowcase() {
  const context = useContext(ShowcaseContext);
  if (!context) throw new Error("useShowcase must be used inside ShowcaseProvider.");
  return context;
}
