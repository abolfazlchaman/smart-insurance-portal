export function SubmissionsSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <div className='skeleton h-8 w-48'></div>
        <div className='skeleton h-10 w-24'></div>
      </div>

      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              {Array.from({ length: 4 }).map((_, index) => (
                <th key={index}>
                  <div className='skeleton h-4 w-24'></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <td key={colIndex}>
                    <div className='skeleton h-4 w-24'></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-center gap-2'>
        <div className='skeleton h-10 w-24'></div>
        <div className='skeleton h-10 w-24'></div>
        <div className='skeleton h-10 w-24'></div>
      </div>
    </div>
  );
}
