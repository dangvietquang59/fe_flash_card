"use client"

import FlashcardSearch from "@/components/FlashcardSearch"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-blue-800">Tìm kiếm từ vựng tiếng Trung</h1>
        <FlashcardSearch />
      </div>
    </div>
  )
} 