import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: number;
  showText?: boolean;
  className?: string;
}

/**
 * Brand mark: rounded icon badge (bag + cart "B") + wordmark.
 * Reused in Navbar, mobile drawer, login screen and footer so the
 * brand reads consistently everywhere.
 */
export default function Logo({
  href = "/",
  size = 40,
  showText = true,
  className = "",
}: LogoProps) {
  const content = (
    <span className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="relative shrink-0 overflow-hidden rounded-[22%] shadow-sm ring-1 ring-black/5 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:rotate-[-3deg]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/brand/logo-128.png"
          alt="BachatMall"
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </span>

      {showText && (
        <span
          className="font-extrabold leading-none tracking-tight"
          style={{ fontSize: size * 0.55 }}
        >
          <span className="text-gray-900">Bachat</span>
          <span className="bg-gradient-to-r from-brand to-pink-500 bg-clip-text text-transparent">
            Mall
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
