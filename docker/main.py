from fastapi import FastAPI

from connection import FastAPI

app = FastAPI(title="Docker 서버")

@app.get(
    "/users",
    summary = "전체 사용자 조회 API"
)
def get_users_handler():
    with SessionFactory() as session:
        stmt = text("SELECT * FROM user;")
        rows = session.execute(stmt).fetchall()

        # 전체 사용자 데이터를 list[dict]로 반환
        users = [row._asdict() for row in rows]

    return users


# 클래스로 테이블 정의 -> ORM
# new_user = User(...)


# class User(Base):
#     __tablename__ = "user"


#     id: Mapped[int] = mapped_column()