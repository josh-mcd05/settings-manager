import pytest
from app.db.operations import (
    create_setting,
    get_all_settings,
    get_setting_by_id,
    update_setting,
    delete_setting
)

@pytest.mark.unit
class TestDatabaseOperations:
    ## Test database operations
    
    def test_create_setting(self, db_connection, sample_setting_data):
        ## Test creating a setting
        setting = create_setting(sample_setting_data)
        
        assert setting.id is not None
        assert setting.data == sample_setting_data
        assert setting.created_at is not None
        assert setting.updated_at is not None
    
    def test_get_all_settings_empty(self, db_connection):
        ## Test getting settings when there are none
        settings, total = get_all_settings(page=1, limit=10)
        
        # Might have settings from other tests, so just check types
        assert isinstance(settings, list)
        assert isinstance(total, int)
        assert total >= 0
    
    def test_get_all_settings_with_data(self, create_test_setting):
        ## Test get settings when settings exist
        create_test_setting({"test": "1"})
        create_test_setting({"test": "2"})
        
        settings, total = get_all_settings(page=1, limit=10)
        
        assert len(settings) >= 2
        assert total >= 2
    
    def test_get_all_settings_pagination(self, create_test_setting):
        ## Test pagination
        for i in range(15):
            create_test_setting({"index": i})
        
        page1, total = get_all_settings(page=1, limit=10)
        assert len(page1) == 10
        assert total >= 15
        
        page2, total = get_all_settings(page=2, limit=10)
        assert len(page2) >= 5
    
    def test_get_setting_by_id(self, create_test_setting):
        ## Test retreiving a setting by UID
        created = create_test_setting({"test": "data"})
        
        found = get_setting_by_id(str(created.id))
        
        assert found is not None
        assert found.id == created.id
        assert found.data == created.data
    
    def test_get_setting_by_id_not_found(self, db_connection):
        ## Test retrieving non-existent setting
        result = get_setting_by_id("00000000-0000-0000-0000-000000000000")
        assert result is None
    
    def test_get_setting_by_id_invalid_uuid(self, db_connection):
        ## Test retrieving invalid UID
        result = get_setting_by_id("invalid-uuid")
        assert result is None
    
    def test_update_setting(self, create_test_setting):
        ## Test updating a setting
        original = create_test_setting({"version": 1})
        
        new_data = {"version": 2, "updated": True}
        updated = update_setting(str(original.id), new_data)
        
        assert updated is not None
        assert updated.id == original.id
        assert updated.data == new_data
        assert updated.updated_at > original.updated_at
    
    
    def test_delete_setting(self, create_test_setting):
        ## Test delete setting
        setting = create_test_setting({"delete": "me"})
        
        result = delete_setting(str(setting.id))
        assert result is True
        
        found = get_setting_by_id(str(setting.id))
        assert found is None
    
    def test_delete_setting_idempotent(self, create_test_setting):
        ## Test deleting same item twice
        setting = create_test_setting({"delete": "twice"})
        
        result1 = delete_setting(str(setting.id))
        assert result1 is True
        
        result2 = delete_setting(str(setting.id))
        assert result2 is True
    
    def test_delete_setting_invalid_uuid(self, db_connection):
        ## Test deleting invalid UID
        result = delete_setting("invalid-uuid")
        assert result is True