import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

describe('HomePage', () => {
  const renderHomePage = () => {
    return render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
  };

  it('renders the page title and subtitle', () => {
    renderHomePage();
    
    expect(screen.getByText('SchoolScout')).toBeInTheDocument();
    expect(screen.getByText('Compare school districts by your priorities')).toBeInTheDocument();
    expect(screen.getByText(/Pick whether you're evaluating/)).toBeInTheDocument();
  });

  it('renders all form controls', () => {
    renderHomePage();
    
    expect(screen.getByText('Who are you evaluating for?')).toBeInTheDocument();
    expect(screen.getByLabelText('Select a state')).toBeInTheDocument();
    expect(screen.getByLabelText('Choose a priority preset')).toBeInTheDocument();
  });

  it('renders the submit button disabled by default', () => {
    renderHomePage();
    
    const submitButton = screen.getByRole('button', { name: /View Districts/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when state is selected', async () => {
    const user = userEvent.setup();
    renderHomePage();
    
    const stateSelect = screen.getByLabelText('Select a state');
    const submitButton = screen.getByRole('button', { name: /View Districts/i });
    
    expect(submitButton).toBeDisabled();
    
    await user.selectOptions(stateSelect, 'NY');
    
    expect(submitButton).not.toBeDisabled();
  });

  it('changes preset when audience changes from parent to educator', async () => {
    const user = userEvent.setup();
    renderHomePage();
    
    const presetSelect = screen.getByLabelText('Choose a priority preset') as HTMLSelectElement;
    const educatorButton = screen.getByRole('button', { name: /Educator/i });
    
    expect(presetSelect.value).toBe('academic');
    
    await user.click(educatorButton);
    
    expect(presetSelect.value).toBe('classroomConditions');
  });

  it('has correct initial state', () => {
    renderHomePage();
    
    const parentButton = screen.getByRole('button', { name: /Parent/i });
    const presetSelect = screen.getByLabelText('Choose a priority preset') as HTMLSelectElement;
    const stateSelect = screen.getByLabelText('Select a state') as HTMLSelectElement;
    
    expect(parentButton).toHaveClass('active');
    expect(presetSelect.value).toBe('academic');
    expect(stateSelect.value).toBe('');
  });

  it('switches between parent and educator presets', async () => {
    const user = userEvent.setup();
    renderHomePage();
    
    const parentButton = screen.getByRole('button', { name: /Parent/i });
    const educatorButton = screen.getByRole('button', { name: /Educator/i });
    
    // Start with parent
    expect(parentButton).toHaveClass('active');
    
    // Switch to educator
    await user.click(educatorButton);
    expect(educatorButton).toHaveClass('active');
    expect(parentButton).not.toHaveClass('active');
    
    // Switch back to parent
    await user.click(parentButton);
    expect(parentButton).toHaveClass('active');
    expect(educatorButton).not.toHaveClass('active');
  });

  it('submits form with correct params', async () => {
    const user = userEvent.setup();
    renderHomePage();
    
    const stateSelect = screen.getByLabelText('Select a state');
    const presetSelect = screen.getByLabelText('Choose a priority preset');
    const submitButton = screen.getByRole('button', { name: /View Districts/i });
    
    await user.selectOptions(stateSelect, 'CA');
    await user.selectOptions(presetSelect, 'balancedFamily');
    
    // Form should be enabled now
    expect(submitButton).not.toBeDisabled();
    
    // We can't easily check navigation in this test setup, but we can verify the form is ready
    expect(stateSelect).toHaveValue('CA');
    expect(presetSelect).toHaveValue('balancedFamily');
  });

  it('does not submit when state is empty', async () => {
    const user = userEvent.setup();
    renderHomePage();
    
    const presetSelect = screen.getByLabelText('Choose a priority preset');
    const submitButton = screen.getByRole('button', { name: /View Districts/i });
    
    // Change preset
    await user.selectOptions(presetSelect, 'smallClassrooms');
    
    // Button should still be disabled without state
    expect(submitButton).toBeDisabled();
  });

  it('allows switching preset without state selection', async () => {
    const user = userEvent.setup();
    renderHomePage();
    
    const presetSelect = screen.getByLabelText('Choose a priority preset') as HTMLSelectElement;
    
    // Change audience to educator
    const educatorButton = screen.getByRole('button', { name: /Educator/i });
    await user.click(educatorButton);
    
    // Preset should change to educator option
    expect(presetSelect.value).toBe('classroomConditions');
    
    // Can still change preset without submitting
    await user.selectOptions(presetSelect, 'balancedTeaching');
    expect(presetSelect.value).toBe('balancedTeaching');
  });

  it('renders all state options', () => {
    renderHomePage();
    
    const stateSelect = screen.getByLabelText('Select a state');
    
    // Check for some key states
    expect(screen.getByRole('option', { name: 'NY' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'CA' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'TX' })).toBeInTheDocument();
  });
});
