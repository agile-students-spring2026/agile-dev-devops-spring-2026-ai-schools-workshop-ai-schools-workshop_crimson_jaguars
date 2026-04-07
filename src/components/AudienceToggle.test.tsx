import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AudienceToggle from './AudienceToggle';

describe('AudienceToggle', () => {
  it('renders both toggle buttons', () => {
    const handleChange = vi.fn();
    render(<AudienceToggle value="parent" onChange={handleChange} />);
    
    expect(screen.getByRole('button', { name: /Parent/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Educator/i })).toBeInTheDocument();
  });

  it('highlights the active button', () => {
    const handleChange = vi.fn();
    const { rerender } = render(<AudienceToggle value="parent" onChange={handleChange} />);
    
    const parentButton = screen.getByRole('button', { name: /Parent/i });
    const educatorButton = screen.getByRole('button', { name: /Educator/i });
    
    expect(parentButton).toHaveClass('active');
    expect(educatorButton).not.toHaveClass('active');

    rerender(<AudienceToggle value="educator" onChange={handleChange} />);
    
    expect(parentButton).not.toHaveClass('active');
    expect(educatorButton).toHaveClass('active');
  });

  it('calls onChange when a button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<AudienceToggle value="parent" onChange={handleChange} />);
    
    const educatorButton = screen.getByRole('button', { name: /Educator/i });
    await user.click(educatorButton);
    
    expect(handleChange).toHaveBeenCalledWith('educator');
  });

  it('renders the correct label', () => {
    const handleChange = vi.fn();
    render(<AudienceToggle value="parent" onChange={handleChange} />);
    
    expect(screen.getByText('Who are you evaluating for?')).toBeInTheDocument();
  });
});
