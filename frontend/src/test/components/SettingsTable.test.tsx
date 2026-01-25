import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SettingsTable } from '../../components/SettingsTable';

const mockSettings = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    data: { theme: 'dark' },
    created_at: '2025-01-19T10:00:00',
    updated_at: '2025-01-19T10:00:00',
  },
];

describe('SettingsTable', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnPageChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render settings table with data', () => {
    render(
      <SettingsTable
        settings={mockSettings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        page={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('550e8400-e29b-41d4-a716-446655440000')).toBeInTheDocument();
  });

  it('should show empty state when no settings', () => {
    render(
      <SettingsTable
        settings={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        page={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText(/No settings found/i)).toBeInTheDocument();
  });

  it('should call onEdit when Edit button clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SettingsTable
        settings={mockSettings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        page={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockSettings[0]);
  });

  it('should call onDelete when Delete button clicked and confirmed', async () => {
    const user = userEvent.setup();
    
    // Mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    
    render(
      <SettingsTable
        settings={mockSettings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        page={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );
  
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
  
    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
  });

  it('should not call onDelete when Delete is cancelled', async () => {
    const user = userEvent.setup();
    
    // Mock window.confirm to return false (cancel)
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    
    render(
      <SettingsTable
        settings={mockSettings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        page={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );
  
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
  
    expect(window.confirm).toHaveBeenCalled();
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should show pagination when multiple pages', () => {
    render(
      <SettingsTable
        settings={mockSettings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        page={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText(/Page 2 of 5/)).toBeInTheDocument();
  });

  it('should not show pagination for single page', () => {
    render(
      <SettingsTable
        settings={mockSettings}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        page={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
  });
});