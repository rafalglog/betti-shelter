import { hasPermission } from "@/app/lib/auth/hasPermission";

interface Props {
  permission: string;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

export async function Authorize({ permission, fallback, children }: Props) {
  const isAllowed = await hasPermission(permission);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
