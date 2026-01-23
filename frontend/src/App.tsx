import { useState, useEffect } from 'react';
import { settingsApi } from './api/settings';
import type { Setting } from './api/settings';
import { SettingsTable } from './components/SettingsTable';
import { SettingModal } from './components/SettingModal';
import './App.css';

function App() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);

  useEffect(() => {
    loadSettings();
  }, [page]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getAll(page, 10);
      setSettings(response.data.data);
      setTotalPages(response.data.pagination.total_pages);
    } catch (error) {
      console.error('Error loading settings:', error);
      alert('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSetting(null);
    setIsModalOpen(true);
  };

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await settingsApi.delete(id);

      const response = await settingsApi.getAll(page, 10);
      setSettings(response.data.data);
      setTotalPages(response.data.pagination.total_pages);

      if (response.data.data.length === 0 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error deleting setting:', error);
      alert('Failed to delete setting');
    }
  };

  const handleSave = async (data: Record<string, any>) => {
    if (editingSetting) {
      await settingsApi.update(editingSetting.id, data);
    } else {
      await settingsApi.create(data);
    }
    loadSettings();
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#212529' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      color: '#212529',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  }}
>
  <div style={{ flex: 1 }}></div>
  <h1 style={{ margin: 0, flex: 1, textAlign: 'center' }}>Settings Management System</h1>
  <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
    <button
      onClick={handleCreate}
      style={{
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#28a745',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      + Create Setting
    </button>
  </div>
</div>

      <SettingsTable
        settings={settings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <SettingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setting={editingSetting}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;