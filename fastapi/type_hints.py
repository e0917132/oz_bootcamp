# Type Hints (타입 힌트)
# 변수가 어떤 타입을 사용하도록 설계되었는지 미리 명시.

name: str ="alex"
price: int = 100
ratio: float = 0.3
is_active: bool = True

# 두가지의 타입을 허용하고 싶을 때
score: int | float = 90

# 함수 타입 힌트
def add(n1:int, n2: int):
    return n1 + n2

# 컬렉션 타입 (COllection Type)
names: list[str] = ["alex", "bob", "chris"]
numbers: list[int | float | None] = [100, 90.5, 80, None]

scores: dict[str, int | None] = {"math": 90, "eng": 100}