from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# 기존 임시 저장소
owner_db = []

class OwnerRegister(BaseModel):
    ownerName: str
    shopName: str
    category: str
    address: str
    description: str

@router.post("/owner/register")
def register_owner(data: OwnerRegister):
    owner_db.append(data.dict())
    index = len(owner_db) - 1
    return {
        "message": "등록 완료",
        "index": index,
        "data": data
    }

@router.get("/owner/list")
def get_owners():
    return {"owners": owner_db}

# 🔥 삭제 기능 추가
@router.delete("/owner/delete/{index}")
def delete_owner(index: int):
    if 0 <= index < len(owner_db):
        removed = owner_db.pop(index)
        return {"message": "삭제 성공", "deleted": removed}
    else:
        raise HTTPException(status_code=404, detail="해당 항목 없음")

@router.put("/owner/update/{index}")
def update_owner(index: int, updated_data: OwnerRegister):
    if 0 <= index < len(owner_db):
        owner_db[index] = updated_data.dict()
        return {"message": "수정 완료", "updated": updated_data}
    else:
        raise HTTPException(status_code=404, detail="해당 사업자 없음")
