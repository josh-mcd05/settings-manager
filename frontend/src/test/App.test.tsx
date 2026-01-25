import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from '../App';
import { resetMockSettings } from './mocks/handlers';

describe('App Integration Tests', () => {
  beforeEach(() => {
    resetMockSettings();
    vi.clearAllMocks();
  });

  it('should render the app title', async () => {
    render(<App />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Settings Management System')).toBeInTheDocument();
  });

  it('should load and display settings', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/550e8400/)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/"theme": "dark"/)).toBeInTheDocument();
  });

  it('should open create modal when Create button clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /Create Setting/i });
    await user.click(createButton);

    expect(screen.getByText('Create New Setting')).toBeInTheDocument();
  });

  it('should create a new setting', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Open create modal
    const createButton = screen.getByRole('button', { name: /Create Setting/i });
    await user.click(createButton);

    // Wait for modal
    await waitFor(() => {
      expect(screen.getByText('Create New Setting')).toBeInTheDocument();
    });

    // Enter JSON data using paste
    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.clear(textarea);
    await user.paste('{"newSetting":true}');

    // Submit
    const submitButton = screen.getByRole('button', { name: /^create$/i });
    await user.click(submitButton);

    // Verify modal closed
    await waitFor(() => {
      expect(screen.queryByText('Create New Setting')).not.toBeInTheDocument();
    });
  });

  it('should open edit modal with existing data', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for settings to load
    await waitFor(() => {
      expect(screen.getByText(/550e8400/)).toBeInTheDocument();
    });

    // Get all edit buttons (there are 2 settings)
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons.length).toBeGreaterThan(0);
    
    // Click first Edit button
    await user.click(editButtons[0]);

    // Verify edit modal opened
    await waitFor(() => {
      expect(screen.getByText('Edit Setting')).toBeInTheDocument();
    });
  });

  it('should delete a setting after confirmation', async () => {
    const user = userEvent.setup();
    
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(<App />);

    // Wait for settings to load (2 settings initially)
    await waitFor(() => {
      expect(screen.getByText(/550e8400/)).toBeInTheDocument();
    });

    // Get all delete buttons
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    const initialCount = deleteButtons.length;
    
    // Click first Delete button
    await user.click(deleteButtons[0]);

    // Wait for one of the settings to disappear
    // After deleting, should have one less setting
    await waitFor(() => {
      const remainingButtons = screen.queryAllByRole('button', { name: /delete/i });
      expect(remainingButtons.length).toBe(initialCount - 1);
    });
  });
});