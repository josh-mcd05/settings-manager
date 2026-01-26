from fastapi import APIRouter, HTTPException, Query
from app.models.setting import (
    SettingCreate,
    SettingUpdate,
    Setting,
    SettingListResponse,
    PaginationInfo
)
from app.db import operations
import math
from psycopg2 import errors as pg_errors 

router = APIRouter()

@router.post("/settings", response_model=Setting, status_code=201)
def create_setting(setting: SettingCreate):
    ## Create a new setting
    try:
        return operations.create_setting(setting.data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create setting: {str(e)}")

@router.get("/settings", response_model=SettingListResponse)
def get_all_settings(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page")
):
    ## Gets paginated list of settings
    try:
        settings, total = operations.get_all_settings(page, limit)
        
        pagination = PaginationInfo(
            total=total,
            page=page,
            limit=limit,
            total_pages=math.ceil(total / limit) if total > 0 else 0
        )
        
        return SettingListResponse(data=settings, pagination=pagination)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch settings: {str(e)}")

@router.get("/settings/{uid}", response_model=Setting)
def get_setting(uid: str):
    ## Gets a single setting by id
    try:
        setting = operations.get_setting_by_id(uid)
        if not setting:
            raise HTTPException(status_code=404, detail="Setting not found")
        return setting
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch setting: {str(e)}")

@router.put("/settings/{uid}", response_model=Setting)
def update_setting(uid: str, setting: SettingUpdate):
    ## Updates an existing setting by ID
    try:
        updated_setting = operations.update_setting(uid, setting.data)
        if not updated_setting:
            raise HTTPException(status_code=404, detail="Setting not found")
        return updated_setting
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update setting: {str(e)}")

@router.delete("/settings/{uid}", status_code=204)
def delete_setting(uid: str):
    ## Delete setting by ID
    try:
        operations.delete_setting(uid)
        return None
    except pg_errors.InvalidTextRepresentation:
        ## Invalid ID, still raises 204
        return None
    except Exception as e:
        ## Catches exception to raise 500 if anything else
        raise HTTPException(status_code=500, detail=f"Failed to delete setting: {str(e)}")