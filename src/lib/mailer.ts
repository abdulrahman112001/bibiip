import "server-only";
import nodemailer from "nodemailer";
import { getSeoData } from "./seo";

/**
 * إرسال إيميل التنبيه برسالة تواصل جديدة - "Best effort" بالكامل: لو
 * إعدادات SMTP (SMTP_HOST/SMTP_USER/SMTP_PASS) مش متظبطة في .env، أو لو
 * الإرسال فشل لأي سبب، بنسجّل الخطأ بس وما بنفشّلش حفظ الرسالة في قاعدة
 * البيانات - الرسالة محفوظة في لوحة التحكم على أي حال، والإيميل مجرد
 * تنبيه إضافي.
 */
export async function sendContactNotification(msg: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const { host, port, user, pass } = {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };

  if (!host || !user || !pass) {
    console.log("[mailer] SMTP مش متظبط - هتفضل الرسالة في لوحة التحكم بس من غير إيميل تنبيه");
    return;
  }

  const { seo } = await getSeoData();
  const to = seo.contactEmail || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"بيب بيب - تواصل معنا" <${user}>`,
    to,
    replyTo: msg.email,
    subject: `رسالة جديدة من ${msg.name} عبر الموقع`,
    text: `الاسم: ${msg.name}\nالإيميل: ${msg.email}\n\nالرسالة:\n${msg.message}`,
    html: `
      <p><strong>الاسم:</strong> ${escapeHtml(msg.name)}</p>
      <p><strong>الإيميل:</strong> ${escapeHtml(msg.email)}</p>
      <p><strong>الرسالة:</strong></p>
      <p>${escapeHtml(msg.message).replace(/\n/g, "<br>")}</p>
    `,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
