import { useId } from "react";
import definition from "@/public/brand/rally-buddy.avatar.json";
import { cn } from "@/lib/utils";

/** Lightweight front-view rendering of the supplied avatar, without a WebGL runtime. */
export function RallyBuddy({ animated = false, className }: { animated?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  const body = definition.body.primary;
  const cone = definition.body.nodes[0];
  const eyes = definition.expressions.neutral.eyes;
  const radius = body.width / 2;
  const baseY = cone.position[1] - cone.surface.height / 2;
  const tipY = cone.position[1] + cone.surface.height / 2;
  const halfBase = cone.surface.width / 2;
  const tipRadius = cone.surface.tipRoundness * 18;
  return (
    <svg aria-hidden="true" viewBox="-126 -126 252 354" className={cn("rally-buddy h-24 w-20 shrink-0", animated && "rally-buddy-loading", className)}>
      <defs>
        <radialGradient id={`${id}-body`} cx="30%" cy="20%" r="85%">
          <stop stopColor="#adedd6" />
          <stop offset="0.48" stopColor={definition.colors.body} />
          <stop offset="1" stopColor="#289a7e" />
        </radialGradient>
      </defs>
      <g fill={`url(#${id}-body)`}>
        <path d={`M ${-halfBase} ${baseY} L ${-tipRadius} ${tipY - tipRadius} Q 0 ${tipY + tipRadius} ${tipRadius} ${tipY - tipRadius} L ${halfBase} ${baseY} Z`} />
        <ellipse rx={radius} ry={body.height / 2} />
      </g>
      <g className="rally-buddy-eyes" fill={definition.colors.eyes}>
        {(["left", "right"] as const).map((side, index) => {
          const eye = eyes[side];
          const x = (index ? 1 : -1) * (eyes.spacing + eye.width) / 2 + eye.x;
          return <rect key={side} x={x - eye.width / 2} y={eye.y - eye.height / 2} width={eye.width} height={eye.height} rx={eye.width / 2} />;
        })}
      </g>
    </svg>
  );
}
