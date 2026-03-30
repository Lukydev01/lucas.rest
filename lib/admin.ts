import { getCurrentUser } from "@/lib/auth";

const ADMIN_EMAILS = [
  "vermillionrose3@gmail.com",
];

export async function isAdmin() {
  const user = await getCurrentUser();

  if (!user?.email) {
    return false;
  }

  return ADMIN_EMAILS.includes(user.email);
}