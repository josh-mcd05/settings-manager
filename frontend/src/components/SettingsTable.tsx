import type { Setting } from '../api/settings';

interface SettingsTableProps {
  settings: Setting[];
  onEdit: (setting: Setting) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const SettingsTable = ({
  settings,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}: SettingsTableProps) => {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this setting?')) {
      onDelete(id);
    }
  };

  return (
    <>
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #dee2e6',
              }}
            >
              <th
                style={{ padding: '1rem', textAlign: 'left', width: '280px' }}
              >
                ID
              </th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Data</th>
              <th
                style={{ padding: '1rem', textAlign: 'left', width: '180px' }}
              >
                Created
              </th>
              <th
                style={{ padding: '1rem', textAlign: 'left', width: '180px' }}
              >
                Updated
              </th>
              <th
                style={{ padding: '1rem', textAlign: 'center', width: '150px' }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {settings.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#6c757d',
                  }}
                >
                  No settings found. Click "Create Setting" to get started!
                </td>
              </tr>
            ) : (
              settings.map((setting) => (
                <tr key={setting.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td
                    style={{
                      padding: '1rem',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#6c757d',
                    }}
                  >
                    {setting.id}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <pre
                      style={{
                        margin: 0,
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        backgroundColor: '#f8f9fa',
                        padding: '0.5rem',
                        borderRadius: '4px',
                        overflow: 'auto',
                        maxHeight: '100px',
                      }}
                    >
                      {JSON.stringify(setting.data, null, 2)}
                    </pre>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '14px' }}>
                    {new Date(setting.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', fontSize: '14px' }}>
                    {new Date(setting.updated_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => onEdit(setting)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(setting.id)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            marginTop: '1rem',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: page === 1 ? '#f8f9fa' : 'white',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              color: '#212529',
            }}
          >
            Previous
          </button>
          <span style={{ color: '#212529' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: page === totalPages ? '#f8f9fa' : 'white',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              color: '#212529',
            }}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};