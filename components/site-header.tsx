import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { PointsBar } from "@/components/points-bar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { PointsDto } from "@/lib/points";

export function SiteHeader({ points }: { points: PointsDto }) {
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
      <div className="ml-auto flex min-w-[108px] flex-col items-end gap-1 min-[900px]:ml-3">
        <Avatar className="size-10 ring-4 ring-white" title="You">
          <AvatarFallback className="bg-eucalyptus text-[13px] font-bold text-white">
            You
          </AvatarFallback>
        </Avatar>
        <PointsBar points={points} className="w-[108px]" />
      </div>
    </header>
  );
}
