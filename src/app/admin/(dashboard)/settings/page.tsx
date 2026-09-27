import { auth } from "@/lib/auth";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const session = await auth();

  return <SettingsForm email={session?.user?.email ?? ""} />;
}
