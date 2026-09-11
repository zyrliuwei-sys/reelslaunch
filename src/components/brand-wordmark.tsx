import { cn } from '@/lib/utils';

export function H3PriceLogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-grid h-[1.42em] w-[1.9em] shrink-0 place-items-center overflow-hidden rounded-[0.26em] border border-current/70 bg-current/[0.08] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]',
        className
      )}
    >
      <span className="absolute inset-[0.14em] grid grid-cols-3 gap-[0.07em]">
        <span className="rounded-[0.08em] bg-current/20" />
        <span className="rounded-[0.08em] bg-current/35" />
        <span className="rounded-[0.08em] bg-current/20" />
      </span>
      <span className="relative text-[0.53em] leading-none font-black tracking-[-0.12em]">
        H3
      </span>
    </span>
  );
}

export function BrandWordmark({
  brand = 'reelslaunch',
  className,
}: {
  brand?: string;
  className?: string;
}) {
  const normalizedBrand = brand.trim() || 'reelslaunch';

  const separator = normalizedBrand.lastIndexOf(' ');
  const name =
    separator > 0 ? normalizedBrand.slice(0, separator) : normalizedBrand;
  const suffix = separator > 0 ? normalizedBrand.slice(separator + 1) : '';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[0.45em] font-sans leading-none whitespace-nowrap text-current',
        className
      )}
    >
      <img
        src="/logo.png"
        alt=""
        aria-hidden="true"
        className="h-[1.55em] w-[1.55em] shrink-0 object-contain"
      />
      <span className="font-[780] tracking-[-0.075em]">{name}</span>
      {suffix ? (
        <span className="ml-[0.34em] inline-flex items-center rounded-[0.24em] border-[0.09em] border-current px-[0.34em] py-[0.1em] text-[0.66em] leading-none font-[680] tracking-[0.03em]">
          {suffix}
        </span>
      ) : null}
    </span>
  );
}
