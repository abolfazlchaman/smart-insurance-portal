export function FormSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-row flex-wrap gap-4 justify-center items-center max-w-full'>
        <div className='btn btn-outline skeleton h-12 w-32'></div>
        <div className='btn btn-outline skeleton h-12 w-32'></div>
        <div className='btn btn-outline skeleton h-12 w-32'></div>
      </div>

      <div className='space-y-6'>
        <div className='skeleton h-8 w-64'></div>

        {/* Form fields skeleton */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className='space-y-2'>
            <div className='skeleton h-4 w-32'></div>
            <div className='skeleton h-12 w-full'></div>
          </div>
        ))}

        <div className='skeleton h-12 w-full'></div>
      </div>
    </div>
  );
}
