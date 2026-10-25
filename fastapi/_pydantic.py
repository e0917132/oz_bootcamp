from pydantic import BaseModel

# 내가 원하는 데이터를 표현 -> 속성 값들의 타입을 보장 -> 객체를 생성하는 시점에 검사하고 타입이 안맞으면 오류
class Item(BaseModel): 
    id: int
    name: str
    price: int

# 원래 파이썬 코드
class ItemOrigin:
    def __init__(self, id:int, name: str, price: int):
        self.id = id
        self.name = name
        self.price = price