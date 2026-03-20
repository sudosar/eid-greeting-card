/*
 * DESIGN: "Lantern Procession" — Atmospheric Depth & Light
 * Lanterns: Ornate Islamic fanous lanterns that sway gently with warm inner glow
 * Uses tight elliptical CSS mask to hide the white/light backgrounds
 * Includes golden chain SVG lines hanging from above
 * MOBILE: Fewer lanterns on small screens, reduced sizes
 */

const LANTERN_1_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-lantern-1-6ZiYH2rjQqBAUDzShcm2rJ.webp";
const LANTERN_2_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663317811558/RG5FZYdGoAj4xjeFM8ak6S/eid-lantern-2-6WSSDv9is6fknfxrZZ2XH3.webp";

interface LanternProps {
  variant: 1 | 2;
  className?: string;
  size?: string;
  swayClass?: string;
  style?: React.CSSProperties;
  showChain?: boolean;
}

function GoldenChain({ height = 40 }: { height?: number }) {
  return (
    <div className="flex justify-center" style={{ marginBottom: -4 }}>
      <svg width="4" height={height} viewBox={`0 0 4 ${height}`} fill="none">
        <line
          x1="2" y1="0" x2="2" y2={height}
          stroke="rgba(212, 168, 67, 0.5)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      </svg>
    </div>
  );
}

function Lantern({ variant, className = "", size = "w-24", swayClass = "animate-lantern-sway", style, showChain = true }: LanternProps) {
  const url = variant === 1 ? LANTERN_1_URL : LANTERN_2_URL;
  const flickerDuration = `${1 + Math.random() * 1.5}s`;

  return (
    <div
      className={`${swayClass} ${className}`}
      style={style}
    >
      {/* Golden chain hanging from above */}
      {showChain && <GoldenChain height={30} />}

      <div className="relative" style={{ animation: `flame-flicker ${flickerDuration} ease-in-out infinite` }}>
        {/* Warm glow halo behind the lantern */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/4 rounded-full"
          style={{
            width: "130%",
            height: "100%",
            background: "radial-gradient(ellipse, rgba(240, 199, 94, 0.22) 0%, rgba(232, 148, 58, 0.1) 30%, transparent 55%)",
            animation: "glow-pulse 3s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        {/* Lantern image with tight elliptical mask */}
        <div
          className={`${size} relative`}
          style={{
            WebkitMaskImage: "radial-gradient(ellipse 40% 46% at 50% 46%, black 55%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 40% 46% at 50% 46%, black 55%, transparent 100%)",
            zIndex: 1,
          }}
        >
          <img
            src={url}
            alt="Islamic lantern"
            className="w-full h-auto object-contain"
            style={{
              filter: "brightness(1.5) contrast(1.2) saturate(1.3)",
            }}
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}

export function LanternScene() {
  return (
    <>
      {/* Left foreground lantern — large, close */}
      <Lantern
        variant={1}
        size="w-16 sm:w-24 md:w-32 lg:w-40"
        className="absolute top-0 left-[2%] sm:left-[6%] z-20"
        swayClass="animate-lantern-sway"
        style={{ "--sway-duration": "4.5s" } as React.CSSProperties}
      />

      {/* Right foreground lantern — large, close */}
      <Lantern
        variant={2}
        size="w-14 sm:w-20 md:w-28 lg:w-36"
        className="absolute top-0 right-[2%] sm:right-[6%] z-20"
        swayClass="animate-lantern-sway-reverse"
        style={{ "--sway-duration": "3.8s" } as React.CSSProperties}
      />

      {/* Left midground lantern — medium — hidden on very small screens */}
      <Lantern
        variant={2}
        size="w-10 sm:w-14 md:w-18 lg:w-22"
        className="absolute top-[5%] left-[15%] sm:left-[20%] z-[15] opacity-75 hidden xs:block sm:block"
        swayClass="animate-lantern-sway"
        style={{ "--sway-duration": "5s" } as React.CSSProperties}
      />

      {/* Right midground lantern — medium — hidden on very small screens */}
      <Lantern
        variant={1}
        size="w-10 sm:w-14 md:w-18 lg:w-22"
        className="absolute top-[3%] right-[13%] sm:right-[18%] z-[15] opacity-75 hidden xs:block sm:block"
        swayClass="animate-lantern-sway-reverse"
        style={{ "--sway-duration": "4.2s" } as React.CSSProperties}
      />

      {/* Center-left background lantern — small, far — hidden on mobile */}
      <Lantern
        variant={1}
        size="w-10 sm:w-12 md:w-16"
        className="absolute top-0 left-[35%] z-[12] opacity-50 hidden sm:block"
        swayClass="animate-lantern-sway"
        style={{ "--sway-duration": "5.5s" } as React.CSSProperties}
        showChain={false}
      />

      {/* Center-right background lantern — small, far — hidden on mobile */}
      <Lantern
        variant={2}
        size="w-10 sm:w-12 md:w-16"
        className="absolute top-0 right-[32%] z-[12] opacity-50 hidden sm:block"
        swayClass="animate-lantern-sway-reverse"
        style={{ "--sway-duration": "6s" } as React.CSSProperties}
        showChain={false}
      />
    </>
  );
}
