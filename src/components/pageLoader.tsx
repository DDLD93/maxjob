import React from 'react'

export default function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50 p-5">
      <div className="w-16 h-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
      <p className="mt-4 text-secondary-600 font-medium">Loading...</p>
    </div>
  )
}
