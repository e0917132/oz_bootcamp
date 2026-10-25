# ORM을 이용해서 데이터베이스에 연결할 때 사용하는 설정
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///fastapi.db"

# 엔진
engine = create_engine(DATABASE_URL, echo=True)

# 세션
# class SessionFactory: ... 처럼 클래스를 만드는 것. -> 단, 함수를 이용해서
SessionFactory = sessionmaker(
    bind=engine, 
    autoflush= False,
    autocommit= False,
    expire_on_commit= False,
    
)

