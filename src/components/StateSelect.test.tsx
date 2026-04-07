import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StateSelect from './StateSelect';

describe('StateSelect', () => {
  const states = ['NY', 'CA', 'TX'];

  it('renders a select element', () => {
    const handleChange = vi.fn();
    render(<StateSelect value="" states={states} onChange={handleChange} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the correct label', () => {
    const handleChange = vi.fn();
    render(<StateSelect value="" states={states} onChange={handleChange} />);
    
    expect(screen.getByLabelText('Select a state')).toBeInTheDocument();
  });

  it('renders all state options', () => {
    const handleChange = vi.fn();
    render(<StateSelect value="" states={states} onChange={handleChange} />);
    
    for (const state of states) {
      expect(screen.getByRole('option', { name: state })).toBeInTheDocument();
    }
  });

  it('has a default empty option', () => {
    const handleChange = vi.fn();
    render(<StateSelect value="" states={states} onChange={handleChange} />);
    
    expect(screen.getByRole('option', { name: 'Choose a state' })).toBeInTheDocument();
  });

  it('shows the selected value', () => {
    const handleChange = vi.fn();
    const { rerender } = render(<StateSelect value="" states={states} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('');

    rerender(<StateSelect value="NY" states={states} onChange={handleChange} />);
    expect(select.value).toBe('NY');
  });

  it('calls onChange when a state is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<StateSelect value="" states={states} onChange={handleChange} />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'CA');
    
    expect(handleChange).toHaveBeenCalledWith('CA');
  });

  it('handles empty states array', () => {
    const handleChange = vi.fn();
    const { container } = render(<StateSelect value="" states={[]} onChange={handleChange} />);
    
    expect(container.querySelector('select')).toBeInTheDocument();
  });
});
