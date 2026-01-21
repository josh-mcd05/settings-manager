from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from datetime import datetime
from uuid import UUID

class SettingBase(BaseModel):
    data: Dict[str, Any] = Field(..., description="Arbitrary JSON configuration data")

class SettingCreate(SettingBase):
    pass

class SettingUpdate(SettingBase):
    pass

class Setting(SettingBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class PaginationInfo(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int

class SettingListResponse(BaseModel):
    data: list[Setting]
    pagination: PaginationInfo