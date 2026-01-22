'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const boardGameTexts = [
  "Rolling the dice...",
  "Shuffling the deck...",
  "Setting up the board...",
  "Drawing cards...",
  "Placing your meeple...",
  "Calculating victory points...",
  "Dealing tiles...",
  "Preparing resources...",
  "Building your strategy...",
  "Gathering the players...",
  "Flipping the hourglass...",
  "Organizing game pieces...",
  "Reading the rulebook...",
  "Entering the dungeon...",
  "Conquering territories...",
  "Trading resources...",
  "Starting a new adventure...",
]

export default function LoadingSpinner() {
  const [text, setText] = useState('')

  useEffect(() => {
    // Pick a random text on mount
    const randomText = boardGameTexts[Math.floor(Math.random() * boardGameTexts.length)]
    setText(randomText)
  }, [])

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24 animate-spin-slow grayscale opacity-40">
          <Image
            src="/logo.png"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>
        <p className="text-sm text-stone-600 font-medium animate-pulse">
          {text}
        </p>
      </div>
    </div>
  )
}
