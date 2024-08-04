"use client"
import React, { useRef } from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

type OverlayVariant = "none" | "light" | "dark"
type MediaType = "image" | "video"
type VideoFit = "cover" | "contain" | "fill"

const backgroundVariants = cva(
  "relative h-full w-full",
  {
    variants: {
      overlay: {
        none: "",
        light: "before:absolute before:inset-0 before:bg-white before:opacity-30",
        dark: "before:absolute before:inset-0 before:bg-black before:opacity-30",
      },
      type: {
        image: "",
        video: "z-10",
      },
    },
    defaultVariants: {
      overlay: "none",
      type: "image",
    },
  }
)

interface BackgroundMediaProps {
  variant?: OverlayVariant
  type?: MediaType
  src: string
  alt?: string
  videoFit?: VideoFit
}

export const BackgroundMedia: React.FC<BackgroundMediaProps> = ({
  variant = "light",
  type = "image",
  src,
  alt = "",
  videoFit = "cover",
}) => {
  const mediaRef = useRef<HTMLVideoElement | null>(null)

  const mediaClasses = cn(
    backgroundVariants({ overlay: variant, type }),
    "overflow-hidden"
  )

  const getVideoClasses = (fit: VideoFit) => {
    const baseClasses = "absolute inset-0 transition-opacity duration-300 pointer-events-none"
    switch (fit) {
      case "cover":
        return cn(baseClasses, "h-full w-full object-cover")
      case "contain":
        return cn(baseClasses, "h-full w-full object-contain")
      case "fill":
        return cn(baseClasses, "h-full w-full object-fill")
      default:
        return cn(baseClasses, "h-full w-full object-cover")
    }
  }

  const renderMedia = () => {
    if (type === "video") {
      return (
        <video
          ref={mediaRef}
          aria-hidden="true"
          muted
          className={getVideoClasses(videoFit)}
          autoPlay
          playsInline
          loop
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    } else {
      return (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover rounded-br-[88px]"
          loading="eager"
        />
      )
    }
  }

  return (
    <div className={mediaClasses}>
      {renderMedia()}
    </div>
  )
}

export default BackgroundMedia