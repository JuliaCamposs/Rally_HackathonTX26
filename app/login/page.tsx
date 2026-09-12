import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, LockKeyhole, MapPin } from "lucide-react";
import { RallyBuddy } from "@/components/rally-buddy";
import { auth0 } from "@/lib/auth0";
import styles from "./login.module.css";

function safeReturnTo(value: string | string[] | undefined): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.startsWith("/") && !candidate.startsWith("//") ? candidate : "/app";
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.7A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.5 14Z" />
      <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 5.9Z" />
    </svg>
  );
}

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#f25022" d="M2 2h9.5v9.5H2z" />
      <path fill="#7fba00" d="M12.5 2H22v9.5h-9.5z" />
      <path fill="#00a4ef" d="M2 12.5h9.5V22H2z" />
      <path fill="#ffb900" d="M12.5 12.5H22V22h-9.5z" />
    </svg>
  );
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}) {
  const session = await auth0.getSession();
  const returnTo = safeReturnTo((await searchParams).returnTo);
  if (session) redirect(returnTo);

  const encodedReturnTo = encodeURIComponent(returnTo);
  const googleConnection = encodeURIComponent(process.env.AUTH0_GOOGLE_CONNECTION ?? "google-oauth2");
  const microsoftConnection = encodeURIComponent(process.env.AUTH0_MICROSOFT_CONNECTION ?? "windowslive");

  return (
    <main className={styles.page}>
      <div className={styles.ambient} aria-hidden="true" />
      <Link href="/" className={styles.back}>
        <ArrowLeft size={17} /> Back to Rally
      </Link>

      <section className={styles.card} aria-labelledby="login-title">
        <div className={styles.brand}>
          <Image src="/brand/rally-logo.svg" alt="Rally" width={122} height={62} priority />
          <span><MapPin size={14} /> Texas Tech University</span>
        </div>

        <div className={styles.buddyWrap}>
          <RallyBuddy animated className={styles.buddy} />
        </div>

        <div className={styles.copy}>
          <p>Your campus. Your people.</p>
          <h1 id="login-title">Welcome to Rally</h1>
          <span>Sign in or create your profile to see what’s happening around you.</span>
        </div>

        <div className={styles.providers}>
          <a href={`/auth/login?connection=${googleConnection}&returnTo=${encodedReturnTo}`}>
            <GoogleMark /> Continue with Google
          </a>
          <a href={`/auth/login?connection=${microsoftConnection}&returnTo=${encodedReturnTo}`}>
            <MicrosoftMark /> Continue with personal Microsoft
          </a>
        </div>

        <p className={styles.assurance}>
          <LockKeyhole size={14} /> Secure authentication powered by Auth0
        </p>
        <p className={styles.terms}>
          By continuing, you agree to Rally’s community guidelines and privacy policy.
        </p>
      </section>
    </main>
  );
}
