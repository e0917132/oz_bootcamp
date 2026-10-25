from fastapi import FastAPI, Path, Query, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy import select

from connection import SessionFactory
from model import Item

app = FastAPI(
    title="AI 헬스케어 7기",
    contact={
        "name": "전은지",
        "email": "e0917132@gmail.com"
    }
)

# 데코레이터(Decorator): 함수를 꾸며주는 기능

# Method(행위) + URL(대상)
# DELETE example.com/users
# -> fastapi 형식으로 아래처럼 적은것.

# @app.get("/hello")
# def root_handler():
#     return {"ping":"pong"}


ITEMS: list[dict[str, int | str]] = []

class ItemResponse(BaseModel):
    id: int
    name: str
    price: int

@app.get(
    "/items",
    summary="전체 상품 조회 API",
    response_model= list[ItemResponse]
)
def get_items_handler():
    session = SessionFactory()

    stmt = select(Item)
    result = session.execute(stmt)
    items: list[Item] = result.scalars().all()
    return items

@app.get(
    "/items/search",
    summary="상품 검색 API",
    response_model= list[ItemResponse]
)
def search_items_handler(
    q: str = Query(..., min_length=2)
):
    session = SessionFactory()

    stmt = select(Item).where(Item.name.contains(q))
    result = session.execute(stmt)
    items = result.scalars().all()
    if not items:
        raise HTTPException(
            status_code=404,
            detail="검색 결과가 없습니다."
        )
    return items 

@app.get(
    "/items/{item_id}",
    summary="단일 상품 조회 API (상세보기)",
    response_model= ItemResponse,
    status_code=200
)
def get_item_detail_handler(
    item_id: int = Path(..., ge=1, le=3)
):  
    session = SessionFactory()
    
    stmt = select(Item).where(Item.id == item_id)
    result = session.execute(stmt)
    item = result.scalar()
    if not item:
        raise HTTPException(
            status_code=404, detail="상품을 찾을 수 없습니다."
        )
    return item
    
class CreateItemRequest(BaseModel):
    name: str
    price: int

@app.post(
    "/items",
    summary="새로운 상품 등록 API",
    response_model= ItemResponse,
    status_code=201
)
def create_new_item_handler(
    # body = CreateItemRequest(name=..., price=...)
    body: CreateItemRequest
):
    session = SessionFactory()

    new_item = Item(name=body.name, price=body.price)
    session.add(new_item)
    session.commit()  # DB 저장
    return new_item

class UpdateItemRequest(BaseModel):
    name: str | None = None
    price: int | None = None

@app.patch(
    "/items/{item_id}",
    summary="상품 수정 API"
)
def update_item_handler(
    item_id: int = Path(..., ge=1),
    body: UpdateItemRequest = Body(...),
):
    session = SessionFactory()

    # 조회
    stmt = select(Item).where(Item.id == item_id)
    result = session.execute(stmt)
    item = result.scalar()
    if not item:
        raise HTTPException(
            status_code=404,
            detail="상품을 찾을 수 없습니다."
        )

    # 수정
    if body.name:
        item.name = body.name
    if body.price:
        item.price = body.price

    session.commit()
    return item


@app.delete(
    "/item/{item_id}",
    summary= "상품 삭제 API",
    response_model= None,
    status_code= 204
)
def delete_item_handler(
    item_id: int = Path(..., ge=1),
):
    # 조회
    session = SessionFactory()
    stmt = select(Item).where(Item.id == item_id)
    result = session.execute(stmt)
    item = result.scalar()
    if not item:
        raise HTTPException(
            status_code=404,
            detail= "상품을 찾을 수 없습니다."
        )

    # 삭제
    session.delete(item)
    session.commit()
        