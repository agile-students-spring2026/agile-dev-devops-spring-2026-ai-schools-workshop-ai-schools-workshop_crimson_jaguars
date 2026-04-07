import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComparePage } from './ComparePage';
import type { ScoredDistrict } from '../lib/types';

describe('ComparePage', () => {
  const mockOnBack = vi.fn();
  const mockDistrict1: ScoredDistrict = {
    id: '1',
    name: 'District A',
    state: 'NY',
    graduationRate: 0.92,
    perPupilSpending: 15000,
    studentTeacherRatio: 14,
    enrollment: 5000,
    povertyIndex: 0.15,
    score: 85,
  };

  const mockDistrict2: ScoredDistrict = {
    id: '2',
    name: 'District B',
    state: 'NY',
    graduationRate: 0.88,
    perPupilSpending: 12000,
    studentTeacherRatio: 16,
    enrollment: 3000,
    povertyIndex: 0.25,
    score: 75,
  };

  it('renders both district names in header', () => {
    render(
      <ComparePage
        districts={[mockDistrict1, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText(/Comparing.*District A.*District B/)).toBeInTheDocument();
  });

  it('displays district names in cards', () => {
    render(
      <ComparePage
        districts={[mockDistrict1, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings[0]).toHaveTextContent('District A');
    expect(headings[1]).toHaveTextContent('District B');
  });

  it('displays overall scores', () => {
    const { container } = render(
      <ComparePage
        districts={[mockDistrict1, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    // Look for score text with more context
    expect(container.textContent).toContain('85');
    expect(container.textContent).toContain('75');
  });

  it('displays all metrics', () => {
    render(
      <ComparePage
        districts={[mockDistrict1, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText('Graduation Rate')).toBeInTheDocument();
    expect(screen.getByText('Per Pupil Spending')).toBeInTheDocument();
    expect(screen.getByText('Student-Teacher Ratio')).toBeInTheDocument();
    expect(screen.getByText('Enrollment')).toBeInTheDocument();
    expect(screen.getByText('Poverty Index')).toBeInTheDocument();
  });

  it('displays metric values correctly', () => {
    const { container } = render(
      <ComparePage
        districts={[mockDistrict1, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    // Graduation rates
    expect(container.textContent).toContain('92.0%');
    expect(container.textContent).toContain('88.0%');
    
    // Per pupil spending
    expect(container.textContent).toContain('$15,000');
    expect(container.textContent).toContain('$12,000');
  });

  it('renders the back button', async () => {
    const user = userEvent.setup();
    mockOnBack.mockClear();
    
    render(
      <ComparePage
        districts={[mockDistrict1, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    await user.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('displays the comparison title', () => {
    render(
      <ComparePage
        districts={[mockDistrict1, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    expect(screen.getByText(/Comparing.*District A.*District B/)).toBeInTheDocument();
  });

  it('displays state information', () => {
    const { container } = render(
      <ComparePage
        districts={[mockDistrict1, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    // State appears in the component
    const stateMatches = (container.textContent?.match(/NY/g) || []).length;
    expect(stateMatches).toBeGreaterThanOrEqual(2);
  });

  it('handles reversed district order', () => {
    const { container } = render(
      <ComparePage
        districts={[mockDistrict2, mockDistrict1]}
        onBack={mockOnBack}
      />
    );
    
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings[0]).toHaveTextContent('District B');
    expect(headings[1]).toHaveTextContent('District A');
  });

  it('formats percentage values correctly', () => {
    const district: ScoredDistrict = {
      ...mockDistrict1,
      graduationRate: 0.955,
      povertyIndex: 0.085,
    };

    const { container } = render(
      <ComparePage
        districts={[district, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    expect(container.textContent).toContain('95.5%');
    expect(container.textContent).toContain('8.5%');
  });

  it('formats currency values with commas', () => {
    const district: ScoredDistrict = {
      ...mockDistrict1,
      perPupilSpending: 25500,
    };

    const { container } = render(
      <ComparePage
        districts={[district, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    expect(container.textContent).toContain('$25,500');
  });

  it('formats enrollment with commas', () => {
    const district: ScoredDistrict = {
      ...mockDistrict1,
      enrollment: 15750,
    };

    const { container } = render(
      <ComparePage
        districts={[district, mockDistrict2]}
        onBack={mockOnBack}
      />
    );
    
    expect(container.textContent).toContain('15,750');
  });
});
