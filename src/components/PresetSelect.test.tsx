import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PresetSelect from './PresetSelect';
import type { PresetOption } from '../lib/presets';

describe('PresetSelect', () => {
  const presetOptions: PresetOption[] = [
    { value: 'academic', label: 'Academic Focus' },
    { value: 'balancedFamily', label: 'Balanced Family Fit' },
  ];

  it('renders a select element', () => {
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="academic"
        options={presetOptions}
        onChange={handleChange}
      />
    );
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders the correct label', () => {
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="academic"
        options={presetOptions}
        onChange={handleChange}
      />
    );
    
    expect(screen.getByLabelText('Choose a priority preset')).toBeInTheDocument();
  });

  it('renders all preset options', () => {
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="academic"
        options={presetOptions}
        onChange={handleChange}
      />
    );
    
    expect(screen.getByRole('option', { name: 'Academic Focus' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Balanced Family Fit' })).toBeInTheDocument();
  });

  it('shows the selected value', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <PresetSelect
        value="academic"
        options={presetOptions}
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('academic');

    rerender(
      <PresetSelect
        value="balancedFamily"
        options={presetOptions}
        onChange={handleChange}
      />
    );
    
    expect(select.value).toBe('balancedFamily');
  });

  it('calls onChange when a preset is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <PresetSelect
        value="academic"
        options={presetOptions}
        onChange={handleChange}
      />
    );
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'balancedFamily');
    
    expect(handleChange).toHaveBeenCalledWith('balancedFamily');
  });

  it('handles single option', () => {
    const handleChange = vi.fn();
    const singleOption: PresetOption[] = [{ value: 'academic', label: 'Academic Focus' }];
    
    render(
      <PresetSelect
        value="academic"
        options={singleOption}
        onChange={handleChange}
      />
    );
    
    expect(screen.getByRole('option', { name: 'Academic Focus' })).toBeInTheDocument();
  });
});
