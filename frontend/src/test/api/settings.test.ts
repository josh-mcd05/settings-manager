import { describe, it, expect, beforeEach } from 'vitest';
import { settingsApi } from '../../api/settings';
import { resetMockSettings } from '../mocks/handlers';

describe('Settings API', () => {
  beforeEach(() => {
    resetMockSettings();
  });

  describe('getAll', () => {
    it('should fetch all settings', async () => {
      const response = await settingsApi.getAll();
      
      expect(response.status).toBe(200);
      expect(response.data.data).toHaveLength(2);
      expect(response.data.pagination.total).toBe(2);
    });

    it('should support pagination parameters', async () => {
      const response = await settingsApi.getAll(1, 5);
      
      expect(response.status).toBe(200);
      expect(response.data.pagination.page).toBe(1);
      expect(response.data.pagination.limit).toBe(5);
    });
  });

  describe('getById', () => {
    it('should fetch a specific setting', async () => {
      const response = await settingsApi.getById('550e8400-e29b-41d4-a716-446655440000');
      
      expect(response.status).toBe(200);
      expect(response.data.id).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(response.data.data).toEqual({ theme: 'dark', notifications: true });
    });

    it('should return 404 for non-existent setting', async () => {
      try {
        await settingsApi.getById('00000000-0000-0000-0000-000000000000');
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('create', () => {
    it('should create a new setting', async () => {
      const newData = { test: 'value', number: 42 };
      const response = await settingsApi.create(newData);
      
      expect(response.status).toBe(201);
      expect(response.data.data).toEqual(newData);
      expect(response.data.id).toBeDefined();
      expect(response.data.created_at).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update an existing setting', async () => {
      const updatedData = { theme: 'light', notifications: false };
      const response = await settingsApi.update(
        '550e8400-e29b-41d4-a716-446655440000',
        updatedData
      );
      
      expect(response.status).toBe(200);
      expect(response.data.data).toEqual(updatedData);
    });

    it('should return 404 for non-existent setting', async () => {
      try {
        await settingsApi.update('00000000-0000-0000-0000-000000000000', {});
      } catch (error: any) {
        expect(error.response.status).toBe(404);
      }
    });
  });

  describe('delete', () => {
    it('should delete a setting', async () => {
      const response = await settingsApi.delete('550e8400-e29b-41d4-a716-446655440000');
      
      expect(response.status).toBe(204);
    });
  });
});