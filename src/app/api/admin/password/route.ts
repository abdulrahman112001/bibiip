import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { ADMIN_ROW_ID, getAdminCredentials } from "@/lib/auth";

const MIN_LENGTH = 8;

/** بيغيّر باسورد الأدمن - لازم يبعت الباسورد الحالي الصح عشان يتأكد إنه فعلًا هو */
export async function PATCH(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON غير صالح" }, { status: 400 });
  }

  const { currentPassword, newPassword } = (body ?? {}) as {
    currentPassword?: unknown;
    newPassword?: unknown;
  };

  if (typeof currentPassword !== "string" || typeof newPassword !== "string" || !currentPassword) {
    return NextResponse.json({ error: "لازم تبعت الباسورد الحالي والباسورد الجديد" }, { status: 400 });
  }

  if (newPassword.length < MIN_LENGTH) {
    return NextResponse.json(
      { error: `الباسورد الجديد لازم يكون ${MIN_LENGTH} حروف على الأقل` },
      { status: 400 }
    );
  }

  const current = await getAdminCredentials();
  if (!current) {
    return NextResponse.json({ error: "بيانات دخول الأدمن مش متظبطة في السيرفر" }, { status: 500 });
  }

  const valid = bcrypt.compareSync(currentPassword, current.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "الباسورد الحالي غلط" }, { status: 400 });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);

  await prisma.adminUser.upsert({
    where: { id: ADMIN_ROW_ID },
    create: { id: ADMIN_ROW_ID, email: current.email, passwordHash: newHash },
    update: { passwordHash: newHash },
  });

  return NextResponse.json({ ok: true });
}
