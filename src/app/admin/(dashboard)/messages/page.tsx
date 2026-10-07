import { prisma } from "@/lib/prisma";
import MessagesInbox from "@/components/admin/MessagesInbox";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const serialized = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    message: m.message,
    read: m.read,
    createdAt: m.createdAt.toISOString(),
  }));

  return <MessagesInbox initialMessages={serialized} />;
}
