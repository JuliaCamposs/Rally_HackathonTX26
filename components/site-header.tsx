import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Icon } from "@/components/icons";
import { PointsBar } from "@/components/points-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PointsDto } from "@/lib/points";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function SiteHeader({
  points,
  user,
}: {
  points: PointsDto;
  user: { name: string; avatarUrl: string | null; avatarColor: string };
}) {
  return (
    <header className="rally-header">
      <Link href="/" aria-label="Rally home" className="rally-logo">
        <Image src="/brand/rally-logo.svg" alt="Rally" width={110} height={56} priority />
      </Link>
      <div className="campus-label">
        <Icon name="pin" className="h-[15px] w-[15px] flex-none" />
        Texas Tech <span className="max-[400px]:hidden">University</span>
      </div>
      <span className="ml-auto hidden text-xs font-medium tracking-wide text-mute min-[900px]:block">
        A little closer to your people.
      </span>
      <div className="ml-auto flex items-center gap-2 min-[900px]:ml-3">
        <div className="flex min-w-[108px] flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="hidden max-w-32 truncate text-xs font-bold text-ink min-[620px]:block">
              {user.name}
            </span>
            <Avatar className="size-10 ring-4 ring-white" title={user.name}>
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />}
              <AvatarFallback
                className="text-[12px] font-bold text-white"
                style={{ backgroundColor: user.avatarColor }}
              >
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <PointsBar points={points} className="w-[108px]" />
        </div>
        <a
          href="/auth/logout"
          aria-label="Log out"
          title="Log out"
          className="grid size-9 place-items-center rounded-xl border border-line bg-white text-mute transition-colors hover:border-[#b8cdbf] hover:text-eucalyptus"
        >
          <LogOut size={15} />
        </a>
      </div>
    </header>
  );
}
