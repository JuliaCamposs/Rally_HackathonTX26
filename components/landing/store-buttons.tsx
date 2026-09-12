import Link from "next/link";

const APP_HREF = "/app";

export function StoreButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href={APP_HREF}
        aria-label="Download on the App Store"
        className="inline-flex h-12 items-center gap-3 rounded-xl bg-[#0b1f18] px-4 text-white shadow-sm transition-transform hover:-translate-y-px"
      >
        <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden="true">
          <path d="M16.37 12.23c-.03-2.23 1.82-3.3 1.9-3.35-1.04-1.52-2.66-1.73-3.23-1.75-1.37-.14-2.68.81-3.38.81-.7 0-1.78-.79-2.93-.77-1.5.02-2.89.88-3.66 2.23-1.57 2.72-.4 6.74 1.12 8.95.75 1.08 1.64 2.29 2.81 2.25 1.13-.05 1.56-.73 2.92-.73 1.36 0 1.75.73 2.94.7 1.22-.02 1.99-1.1 2.73-2.19.86-1.25 1.21-2.47 1.23-2.53-.03-.01-2.36-.9-2.39-3.58ZM14.7 5.9c.62-.75 1.04-1.8.92-2.84-.89.04-1.97.6-2.61 1.35-.57.66-1.08 1.73-.94 2.75 1 .08 2.02-.51 2.63-1.26Z" />
        </svg>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] font-medium opacity-80">Download on the</span>
          <span className="text-[15px] font-semibold tracking-tight">App Store</span>
        </span>
      </Link>
      <Link
        href={APP_HREF}
        aria-label="Get it on Google Play"
        className="inline-flex h-12 items-center gap-3 rounded-xl bg-[#0b1f18] px-4 text-white shadow-sm transition-transform hover:-translate-y-px"
      >
        <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
          <path fill="#34A853" d="M3.6 21.2 13.2 12 3.6 2.8v18.4Z" />
          <path fill="#FBBC04" d="M16.7 8.6 13.2 12l3.5 3.4 4.1-2.35c.9-.52.9-1.98 0-2.5L16.7 8.6Z" />
          <path fill="#4285F4" d="M16.7 15.4 13.2 12 3.6 21.2c.4.7 1.2.8 2 .36l11.1-6.16Z" />
          <path fill="#EA4335" d="M16.7 8.6 5.6 2.44C4.8 2 4 2.1 3.6 2.8L13.2 12l3.5-3.4Z" />
        </svg>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] font-medium opacity-80">Get it on</span>
          <span className="text-[15px] font-semibold tracking-tight">Google Play</span>
        </span>
      </Link>
    </div>
  );
}
