from fastapi import FastAPI, Path, Query

app = FastAPI()

# 데코레이터(Decorator): 함수를 꾸며주는 기능

# Method(행위) + URL(대상)
# DELETE example.com/users
# -> fastapi 형식으로 아래처럼 적은것.

# @app.get("/hello")
# def root_handler():
#     return {"ping":"pong"}


ITEMS = (
    {"id":1, "name":"apple", "price":100},
    {"id":2, "name":"banana", "price":200},
    {"id":3, "name":"cherry", "price":300},
)



@app.get(
        "/items",
        summary="전체 상품 조회 API"
)
def get_items_handler():
    return ITEMS


@app.get(
        "/items/search",
        summary="상품 검색 API"
)
def search_items_handler(
    q: str = Query(..., max_length=3),
):
    searched = []
    for item in ITEMS:
        if q in item["name"]:
            searched.append(item)
    return searched


# Path Parameter
@app.get(
        "/items/{item_id}",
        summary="단일 상품 조회 API"
)
def get_items_detail_handler(
    item_id: int = Path(..., ge=1, le=3)
):    
    return ITEMS[item_id - 1]


