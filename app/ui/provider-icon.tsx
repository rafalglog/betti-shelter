'use client'

import Image from "next/image"
import { useState } from "react"

interface ProviderIconProps {
  providerId: string
  providerName: string
  className?: string
}

export function ProviderIcon({ providerId, providerName, className = "w-5 h-5" }: ProviderIconProps) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    // Fallback icon when image fails to load
    return (
      <div className={`${className} bg-gray-300 rounded flex items-center justify-center`}>
        <span className="text-xs font-bold text-gray-600">
          {providerId.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={`https://authjs.dev/img/providers/${providerId}.svg`}
      alt={`${providerName} logo`}
      width={20}
      height={20}
      className={className}
      onError={() => setImageError(true)}
    />
  )
}