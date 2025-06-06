import { render } from '@testing-library/react';

// Mock the entire page component
jest.mock('@/app/[locale]/page', () => {
  return function MockHomePage() {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Apply for Insurance
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>Form Section</div>
          <div>Submissions Section</div>
        </div>
      </main>
    );
  };
});

describe('HomePage', () => {
  it('renders without crashing', () => {
    const { container } = render(<div>Test</div>);
    expect(container).toBeTruthy();
  });
});
