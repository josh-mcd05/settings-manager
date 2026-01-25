import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SettingModal } from '../../components/SettingModal';

describe('SettingModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <SettingModal
        isOpen={false}
        onClose={mockOnClose}
        setting={null}
        onSave={mockOnSave}
      />
    );

    expect(screen.queryByText(/Create New Setting/i)).not.toBeInTheDocument();
  });

  it('should render create mode when setting is null', () => {
    render(
      <SettingModal
        isOpen={true}
        onClose={mockOnClose}
        setting={null}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Create New Setting')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('should render edit mode with existing setting', () => {
    const setting = {
      id: '123',
      data: { theme: 'dark' },
      created_at: '2025-01-19T10:00:00',
      updated_at: '2025-01-19T10:00:00',
    };

    render(
      <SettingModal
        isOpen={true}
        onClose={mockOnClose}
        setting={setting}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('Edit Setting')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('should call onSave with valid JSON', async () => {
    const user = userEvent.setup();
    mockOnSave.mockResolvedValue(undefined);

    render(
      <SettingModal
        isOpen={true}
        onClose={mockOnClose}
        setting={null}
        onSave={mockOnSave}
      />
    );

    const textarea = screen.getByRole('textbox');
    const createButton = screen.getByRole('button', { name: /create/i });

    // Use paste instead of type for special characters
    await user.click(textarea);
    await user.clear(textarea);
    await user.paste('{"test": "value"}');
    await user.click(createButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({ test: 'value' });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should show error for invalid JSON', async () => {
    const user = userEvent.setup();

    render(
      <SettingModal
        isOpen={true}
        onClose={mockOnClose}
        setting={null}
        onSave={mockOnSave}
      />
    );

    const textarea = screen.getByRole('textbox');
    const createButton = screen.getByRole('button', { name: /create/i });

    // Use paste for invalid JSON
    await user.click(textarea);
    await user.clear(textarea);
    await user.paste('{invalid json}');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid JSON format/i)).toBeInTheDocument();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('should call onClose when Cancel clicked', async () => {
    const user = userEvent.setup();

    render(
      <SettingModal
        isOpen={true}
        onClose={mockOnClose}
        setting={null}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});