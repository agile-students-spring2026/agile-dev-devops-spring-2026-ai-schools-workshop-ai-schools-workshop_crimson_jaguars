import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // If it doesn't crash, that's a win
    expect(document.body).toBeInTheDocument();
  });

  it('renders the home page on initial load', () => {
    render(<App />);
    
    // HomePage should be visible
    expect(screen.getByText('SchoolScout')).toBeInTheDocument();
    expect(screen.getByText(/Compare school districts/)).toBeInTheDocument();
  });
});
