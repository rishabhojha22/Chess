"use client"
import Image from "next/image"

interface LogoProps {
  size?: number
}

// Ensure the logo has fixed dimensions and doesn't change on hover
export default function Logo({ size = 48 }: LogoProps) {
  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
      }}
    >
      <Image
        src="/images/logo/CMU.png"
        alt="Chess Game Logo"
        width={size}
        height={size}
        style={{ maxWidth: "100%", maxHeight: "100%" }}
      />
    </div>
  )
}

