import "server-only";
import nodemailer from "nodemailer";
import { getSeoData } from "./seo";

type SmtpCreds = { host: string; port: number; user: string; pass: string };

function getSmtpCreds(): SmtpCreds | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? 465);
  if (!host || !user || !pass) return null;
  return { host, port, user, pass };
}

function getTransporter(creds: SmtpCreds) {
  return nodemailer.createTransport({
    host: creds.host,
    port: creds.port,
    secure: creds.port === 465,
    auth: { user: creds.user, pass: creds.pass },
  });
}

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
  const creds = getSmtpCreds();
  if (!creds) {
    console.log("[mailer] SMTP مش متظبط - هتفضل الرسالة في لوحة التحكم بس من غير إيميل تنبيه");
    return;
  }

  const { seo } = await getSeoData();
  const to = seo.contactEmail || creds.user;

  await getTransporter(creds).sendMail({
    from: `"بيب بيب - تواصل معنا" <${creds.user}>`,
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

/**
 * رد الأدمن على رسالة تواصل من داخل الداشبورد - بيتبعت من إيميل الشركة
 * نفسه (مش من إيميل الأدمن الشخصي). على عكس التنبيه، لازم نرمي خطأ واضح
 * لو SMTP مش متظبط، عشان الأدمن يعرف إن الرد ما اتبعتش فعليًا.
 */
export async function sendReplyEmail(opts: {
  to: string;
  subject: string;
  body: string;
}): Promise<void> {
  const creds = getSmtpCreds();
  if (!creds) {
    throw new Error("إعدادات إرسال الإيميل (SMTP) لسه مش متظبطة على السيرفر");
  }

  const { seo, brand } = await getSeoData();
  const fromName = seo.siteName.ar || brand.name.ar;

  await getTransporter(creds).sendMail({
    from: `"${fromName}" <${creds.user}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.body,
    html: `<p>${escapeHtml(opts.body).replace(/\n/g, "<br>")}</p>`,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
