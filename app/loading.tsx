export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
  )
}
