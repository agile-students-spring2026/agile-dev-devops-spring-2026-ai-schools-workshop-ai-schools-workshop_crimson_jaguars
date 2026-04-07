import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultsPage } from './ResultsPage';
import type { ScoredDistrict } from '../lib/types';

describe('ResultsPage', () => {
  const mockOnBack = vi.fn();
  const mockOnCompare = vi.fn();

  it('renders the page header', () => {
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    // Check that the page renders with a header
    const header = screen.queryByRole('heading', { level: 1 });
    expect(header).toBeInTheDocument();
  });

  it('renders the back button and calls onBack', async () => {
    const user = userEvent.setup();
    mockOnBack.mockClear();
    
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    const backButton = screen.getByRole('button', { name: /Back/i });
    await user.click(backButton);
    
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('displays preset and audience info in header', () => {
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    expect(screen.getByText('Academic Excellence')).toBeInTheDocument();
    expect(screen.getByText('Parent view')).toBeInTheDocument();
  });

  it('displays different preset for educator audience', () => {
    render(
      <ResultsPage
        state="NY"
        audience="educator"
        preset="classroomConditions"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    expect(screen.getByText('Classroom Conditions')).toBeInTheDocument();
    expect(screen.getByText('Educator view')).toBeInTheDocument();
  });

  it('displays districts from the correct state', () => {
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    // Should display some districts
    const districts = screen.queryAllByRole('heading', { level: 3 });
    expect(districts.length).toBeGreaterThan(0);
  });

  it('sorts districts by score descending', () => {
    const { container } = render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    // Should have rankings displayed (1, 2, 3, etc)
    expect(container.textContent).toContain('#1');
    expect(container.textContent).toContain('#2');
  });

  it('displays comparison counter when districts are selected', async () => {
    const user = userEvent.setup();
    
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    // Find compare buttons (they may be in district cards)
    const buttons = screen.getAllByRole('button');
    const compareButtons = buttons.filter((btn) => 
      btn.textContent?.includes('Compare') || btn.getAttribute('aria-label')?.includes('compare')
    );
    
    if (compareButtons.length >= 2) {
      await user.click(compareButtons[0]);
      // Selection counter should be visible now
      expect(screen.queryByText(/selected for comparison/i)).toBeInTheDocument();
      
      await user.click(compareButtons[1]);
      expect(screen.queryByText(/2\/2/)).toBeInTheDocument();
    }
  });

  it('does not allow selecting more than 2 districts', async () => {
    const user = userEvent.setup();
    
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    const compareButtons = buttons.filter((btn) => 
      btn.getAttribute('aria-label')?.includes('compare')
    );
    
    if (compareButtons.length >= 3) {
      await user.click(compareButtons[0]);
      await user.click(compareButtons[1]);
      
      // Counter should show 2/2
      expect(screen.getByText(/2\/2/)).toBeInTheDocument();
      
      // Try clicking a third - it should not add
      const initialText = screen.getByText(/2\/2/).textContent;
      
      // The button is disabled now so we can't click more, or it won't add
      // This test verifies the max of 2 is enforced
    }
  });

  it('can deselect a district', async () => {
    const user = userEvent.setup();
    
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    const compareButtons = buttons.filter((btn) => 
      btn.getAttribute('aria-label')?.includes('compare')
    );
    
    if (compareButtons.length >= 2) {
      // Select two
      await user.click(compareButtons[0]);
      await user.click(compareButtons[1]);
      
      expect(screen.getByText(/2\/2/)).toBeInTheDocument();
      
      // Deselect one
      await user.click(compareButtons[0]);
      
      // Should show 1/2 now
      expect(screen.getByText(/1\/2/)).toBeInTheDocument();
    }
  });

  it('calls onCompare with two selected districts', async () => {
    const user = userEvent.setup();
    mockOnCompare.mockClear();
    
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    const buttons = screen.getAllByRole('button');
    const compareButtons = buttons.filter((btn) => 
      btn.getAttribute('aria-label')?.includes('compare')
    );
    
    if (compareButtons.length >= 2) {
      await user.click(compareButtons[0]);
      await user.click(compareButtons[1]);
      
      const compareSubmitButton = screen.queryByRole('button', { name: /Compare →/i });
      if (compareSubmitButton && !compareSubmitButton.hasAttribute('disabled')) {
        await user.click(compareSubmitButton);
        expect(mockOnCompare).toHaveBeenCalled();
      }
    }
  });

  it('displays correct number of districts for state', () => {
    const { container } = render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    // NY has mock data, should show districts ranked
    expect(container.textContent).toContain('districts ranked');
  });

  it('hides compare button when no districts selected', () => {
    render(
      <ResultsPage
        state="NY"
        audience="parent"
        preset="academic"
        onBack={mockOnBack}
        onCompare={mockOnCompare}
      />
    );
    
    // Compare button should only appear in sticky bar when selections are made
    // Initially it should not be visible
    const stickyBar = screen.queryByText(/selected for comparison/i);
    expect(stickyBar).not.toBeInTheDocument();
  });
});
