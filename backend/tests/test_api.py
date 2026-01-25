import pytest

@pytest.mark.integration
class TestSettingsAPI:
    ## Test API
    
    def test_health_check(self, client):
        ## Test health endpoint
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
    
    def test_create_setting(self, client, sample_setting_data):
        ## Test POST, creating a setting
        response = client.post(
            "/api/settings",
            json={"data": sample_setting_data}
        )
        
        assert response.status_code == 201
        data = response.json()
        
        assert "id" in data
        assert data["data"] == sample_setting_data
        assert "created_at" in data
        assert "updated_at" in data
    
    def test_create_setting_invalid_data(self, client):
        ## Test POST with invalid data
        response = client.post(
            "/api/settings",
            json={"data": "not a dict"}
        )
        
        assert response.status_code == 422
    
    def test_create_setting_missing_data(self, client):
        ## Test POST with missing data
        response = client.post(
            "/api/settings",
            json={}
        )
        
        assert response.status_code == 422
    
    def test_get_all_settings(self, client):
        ## Test GET, retrieving settings
        response = client.get("/api/settings")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "data" in data
        assert "pagination" in data
        assert isinstance(data["data"], list)
        assert "total" in data["pagination"]
        assert "page" in data["pagination"]
    
    def test_get_all_settings_pagination(self, client):
        ## Test GET with pagination parameters
        response = client.get("/api/settings?page=1&limit=5")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["limit"] == 5
    
    def test_get_setting_by_id(self, client, sample_setting_data):
        ## Test GET with UID, retrieving specific setting
        create_response = client.post(
            "/api/settings",
            json={"data": sample_setting_data}
        )
        setting_id = create_response.json()["id"]
        
        response = client.get(f"/api/settings/{setting_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == setting_id
        assert data["data"] == sample_setting_data
    
    def test_get_setting_by_id_not_found(self, client):
        ## Test GET with UID with non-existent UID
        response = client.get("/api/settings/00000000-0000-0000-0000-000000000000")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()
    
    def test_update_setting(self, client, sample_setting_data):
        ## Test PUT with UID, updating setting
        create_response = client.post(
            "/api/settings",
            json={"data": sample_setting_data}
        )
        setting_id = create_response.json()["id"]
        
        new_data = {"theme": "light", "notifications": False}
        response = client.put(
            f"/api/settings/{setting_id}",
            json={"data": new_data}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == setting_id
        assert data["data"] == new_data
    
    def test_update_setting_not_found(self, client):
        ## Test PUT with UID on non-existent UID
        response = client.put(
            "/api/settings/00000000-0000-0000-0000-000000000000",
            json={"data": {"test": "data"}}
        )
        
        assert response.status_code == 404
    
    def test_delete_setting(self, client, sample_setting_data):
        ## Test DELETE
        create_response = client.post(
            "/api/settings",
            json={"data": sample_setting_data}
        )
        setting_id = create_response.json()["id"]
        
        response = client.delete(f"/api/settings/{setting_id}")
        
        assert response.status_code == 204
        assert response.content == b"" 
        
        get_response = client.get(f"/api/settings/{setting_id}")
        assert get_response.status_code == 404
    
    def test_delete_setting_idempotent(self, client, sample_setting_data):
        ## Test DELETE twice for idempotency
        create_response = client.post(
            "/api/settings",
            json={"data": sample_setting_data}
        )
        setting_id = create_response.json()["id"]
        
        response1 = client.delete(f"/api/settings/{setting_id}")
        assert response1.status_code == 204
        
        response2 = client.delete(f"/api/settings/{setting_id}")
        assert response2.status_code == 204
    
    def test_delete_setting_invalid_uuid(self, client):
        ## Test DELETE with invalid UID
        response = client.delete("/api/settings/invalid-uuid")
        assert response.status_code == 204
    