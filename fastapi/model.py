# ORM의 클래스와 테이블 연결 정보
from sqlalchemy import Integer, String
from sqlalchemy.orm import DeclarativeBase, mapped_column, Mapped


# 테이블 정의 부모 클래스
class Base(DeclarativeBase):
    pass


class Item(Base):
    __tablename__ = "item"

    # 데이터베이스의 컬럼에 타입을 고정하는 이유: 1. 일관성, 2. 저장공간 효율성
    id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    name: Mapped[str] = mapped_column(String(64))
    price: Mapped[int] = mapped_column(Integer)


