import { http, HttpResponse } from 'msw';

const API_BASE = '/api';

// Mock data
const mockSettings = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    data: { theme: 'dark', notifications: true },
    created_at: '2025-01-19T10:00:00',
    updated_at: '2025-01-19T10:00:00',
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    data: { language: 'en', fontSize: 14 },
    created_at: '2025-01-19T11:00:00',
    updated_at: '2025-01-19T11:00:00',
  },
];

let settings = [...mockSettings];

export const handlers = [
  // GET all settings
  http.get(`${API_BASE}/settings`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedSettings = settings.slice(start, end);
    
    return HttpResponse.json({
      data: paginatedSettings,
      pagination: {
        total: settings.length,
        page,
        limit,
        total_pages: Math.ceil(settings.length / limit),
      },
    });
  }),

  // GET single setting
  http.get(`${API_BASE}/settings/:id`, ({ params }) => {
    const { id } = params;
    const setting = settings.find((s) => s.id === id);
    
    if (!setting) {
      return new HttpResponse(null, { 
        status: 404,
        statusText: 'Not Found'
      });
    }
    
    return HttpResponse.json(setting);
  }),

  // POST create setting
  http.post(`${API_BASE}/settings`, async ({ request }) => {
    const body = await request.json() as { data: Record<string, any> };
    
    const newSetting = {
      id: crypto.randomUUID(),
      data: body.data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    settings.push(newSetting);
    
    return HttpResponse.json(newSetting, { status: 201 });
  }),

  // PUT update setting
  http.put(`${API_BASE}/settings/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = await request.json() as { data: Record<string, any> };
    
    const index = settings.findIndex((s) => s.id === id);
    
    if (index === -1) {
      return new HttpResponse(null, { 
        status: 404,
        statusText: 'Not Found'
      });
    }
    
    settings[index] = {
      ...settings[index],
      data: body.data,
      updated_at: new Date().toISOString(),
    };
    
    return HttpResponse.json(settings[index]);
  }),

  // DELETE setting
  http.delete(`${API_BASE}/settings/:id`, ({ params }) => {
    const { id } = params;
    settings = settings.filter((s) => s.id !== id);
    
    return new HttpResponse(null, { status: 204 });
  }),
];

// Reset function for tests
export function resetMockSettings() {
  settings = [...mockSettings];
}