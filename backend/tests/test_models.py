import pytest
from pydantic import ValidationError
from app.models.setting import (
    SettingCreate,
    SettingUpdate,
    Setting,
    PaginationInfo,
    SettingListResponse
)
from datetime import datetime
from uuid import uuid4

class TestSettingModels:
    ## Test model creation
    
    def test_setting_create_valid(self):
        ## Test creation of setting
        data = {"theme": "dark", "notifications": True}
        setting = SettingCreate(data=data)
        
        assert setting.data == data
        assert isinstance(setting.data, dict)
    
    def test_setting_create_invalid_missing_data(self):
        ## Test create fails if given no data
        with pytest.raises(ValidationError) as exc_info:
            SettingCreate()
        
    
    def test_setting_create_invalid_data_type(self):
        ## Test create fails with data other than dic
        with pytest.raises(ValidationError):
            SettingCreate(data="not a dictionary")
        
    
    def test_pagination_info(self):
        ## Test pagination model
        pagination = PaginationInfo(
            total=100,
            page=2,
            limit=10,
            total_pages=10
        )
        
        assert pagination.total == 100
        assert pagination.page == 2
        assert pagination.total_pages == 10