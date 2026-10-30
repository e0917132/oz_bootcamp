## 1. Docker란?

내 코드와 그 코드가 돌아가는 데 필요한 모든 것(파이썬 버전, 라이브러리, 설정)을 **하나의 상자에 담아서**, 어느 컴퓨터에서 열어도 똑같이 실행되게 해 주는 도구.

- 상자 안은 내 컴퓨터와 **분리된 공간**이라, 내 PC에 뭐가 깔려 있든 영향을 받지 않는다
- 그래서 팀원 PC, 서버, 클라우드 어디에 옮겨도 동작이 같다
- 개발하면서 자주 듣는 "내 컴퓨터에선 잘 되는데?"를 없애는 게 목적

> 📌 내가 이해한 한 문장: **환경 설정을 손으로 하지 않고 파일로 적어 둔다.**

### 왜 Docker를 쓸까?

우리 팀 과제를 예로 들면,
- 나는 macOS + Python 3.13, 팀원은 Windows + 다른 파이썬 버전
- MySQL도 각자 설치하면 버전과 비밀번호 설정이 제각각이 된다
- 실제로 팀원이 `uv`가 안 깔려서, 가상환경이 꼬여서 시간을 꽤 썼다

Docker를 쓰면 이런 설정을 **Dockerfile / docker-compose.yml 한두 개로 고정**하고, 팀원은 그 파일로 실행만 하면 된다.

### Docker Desktop
- Mac·Windows에서 Docker를 쓰기 위한 프로그램 (화면에서 컨테이너·이미지 상태도 볼 수 있음)
- 공식 사이트에서 받아 설치하면 터미널의 `docker` 명령어도 같이 생긴다. 로그인은 안 해도 됨
- ⚠️ **앱이 켜져 있어야** 터미널 명령이 동작한다. 꺼져 있으면 `Cannot connect to the Docker daemon` 에러

### ➕ 가상머신(VM)과 무엇이 다를까?

| | 가상머신 (VM) | Docker 컨테이너 |
|---|---|---|
| 구조 | OS 전체(게스트 OS)를 통째로 띄움 | 호스트 OS의 커널을 **공유**하고 프로세스만 격리 |
| 크기 | 수 GB | 수십~수백 MB |
| 시작 속도 | 수십 초~분 | 보통 **1초 안팎** |
| 용도 | OS 단위 격리 | 앱 단위 격리, 배포 |

---

## 2. Docker 핵심 개념

Docker에서 가장 먼저 구분해야 하는 두 가지.

| | Image (이미지) | Container (컨테이너) |
|---|---|---|
| 한마디로 | 실행 환경을 찍어 둔 **틀** | 그 틀로 찍어 낸 **실행 중인 프로그램** |
| 상태 | 멈춰 있는 파일 묶음 (읽기 전용) | 살아 움직이는 프로세스 |
| 만드는 법 | `docker build` (또는 `docker pull`) | `docker run` |
| 확인 | `docker images` | `docker ps` |

> 💡 파이썬으로 비유하면 **이미지 = 클래스, 컨테이너 = 그 클래스로 만든 객체**.
> 붕어빵 틀 하나로 붕어빵을 여러 개 굽듯, 이미지 하나로 컨테이너를 여러 개 띄울 수 있다.
> 컨테이너를 지워도 이미지는 남아 있다.

### 직접 해 보기: 파이썬을 설치하지 않고 파이썬 쓰기
```bash
docker run -it python:3.13-slim bash   # 파이썬이 들어 있는 컨테이너를 띄우고 그 안의 셸로 들어감
python --version                        # 내 Mac이 아니라 "컨테이너 안" 파이썬 버전이 나옴
pip list                                # 거의 아무것도 안 깔린 깨끗한 환경
exit                                    # 나오면 컨테이너는 멈춤
```
- `-it`: 컨테이너 안 터미널과 대화할 수 있게 연결
- 처음 실행할 땐 이미지가 없어서 **Docker Hub에서 자동으로 받아온다** (두 번째부터는 바로 뜸)

### 전체 흐름
```
 Dockerfile ──docker build──▶ Image ──docker run──▶ Container
 (레시피 작성)                 (틀)                  (실행 → 사용 → stop / rm)
```

### ➕ 알아두면 좋은 용어

| 용어 | 설명 |
|---|---|
| **Docker Hub** | 이미지 저장소(레지스트리). `python`, `mysql`, `redis` 같은 공식 이미지를 받아온다 |
| **태그(tag)** | 이미지 버전 이름. `python:3.13-slim`에서 `3.13-slim`이 태그. 생략하면 `latest` |
| **slim / alpine** | 불필요한 패키지를 뺀 가벼운 이미지. `slim`이 호환성이 좋아 파이썬에서 많이 쓴다 |
| **레이어(layer)** | Dockerfile의 명령어 한 줄마다 레이어가 쌓이고, 바뀌지 않은 레이어는 **캐시**로 재사용된다 |

---

## 3. Dockerfile이란?

이미지를 어떻게 만들지 **위에서부터 순서대로 적은 레시피 파일**. 파일 이름은 확장자 없이 `Dockerfile`.
"어떤 바탕 위에서 → 무엇을 넣고 → 무엇을 설치하고 → 켤 때 뭘 실행할지"를 적는다.

### 수업 실습에서 쓴 Dockerfile
```dockerfile
FROM python:3.13-slim                # 바탕: 파이썬 3.13이 깔린 가벼운 리눅스
WORKDIR /app                         # 이후 작업은 컨테이너 안 /app 폴더에서
COPY main.py main.py                 # 내 main.py를 컨테이너 /app/main.py로 복사
RUN pip install "fastapi[standard]"  # 이미지 만들 때 라이브러리 설치
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

| 명령어 | 내가 이해한 의미 | 언제 실행? |
|---|---|---|
| `FROM` | 어떤 이미지를 바탕으로 시작할지 (항상 맨 처음) | 빌드 |
| `WORKDIR` | 컨테이너 안에서 `cd`할 폴더. 없으면 만들어 줌 | 빌드 |
| `COPY` | `COPY <내 PC 경로> <컨테이너 경로>`로 파일 넣기 | 빌드 |
| `RUN` | 터미널 명령 실행. 주로 설치용 | 빌드 |
| `CMD` | 컨테이너를 켤 때 실행할 명령. 보통 서버 실행 | **run** |

> ⚠️ 헷갈렸던 점: `RUN`은 이미지를 **만드는 순간** 한 번 실행되고 결과가 이미지에 저장된다.
> `CMD`는 이미지에 "켜지면 이거 해"라고 **적어만 두고**, `docker run` 할 때마다 실행된다.

### `--host 0.0.0.0`이 꼭 필요한 이유
- 기본값 `127.0.0.1`은 **컨테이너 자기 자신**에서 오는 요청만 받는다
- 그러면 내 컴퓨터(브라우저)에서 보낸 요청이 컨테이너 안으로 들어오지 못한다
- `0.0.0.0` = "모든 곳에서 오는 요청을 받겠다"

### ➕ 빌드 속도를 높이는 순서 (레이어 캐시 활용)
코드는 자주 바뀌고 라이브러리 목록은 가끔 바뀐다. **자주 바뀌는 것을 아래쪽에** 두면 `pip install`을 매번 다시 하지 않는다.

```dockerfile
FROM python:3.13-slim
WORKDIR /app

COPY requirements.txt .               # ① 라이브러리 목록만 먼저 복사
RUN pip install -r requirements.txt   # ② requirements.txt가 그대로면 캐시 사용

COPY . .                              # ③ 코드는 마지막에 복사
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### ➕ `.dockerignore`
이미지에 넣지 않을 파일을 지정한다. (`.gitignore`와 같은 역할)
```
.venv/
__pycache__/
.env
models/
.git/
```
- `.venv`를 넣으면 이미지가 커지고, 내 OS용 패키지라 컨테이너에서 깨질 수 있다
- `.env`(비밀번호, API 키)는 이미지에 **넣지 않는다**
- llm 실습의 `.gguf`처럼 큰 모델 파일은 이미지에 넣지 않고 **볼륨으로 연결**한다

---

## 4. 이미지 빌드 & 실행

### ① 빌드: Dockerfile → 이미지
```bash
docker build -t fastapi .
```
- `-t fastapi`: 만들어질 이미지에 `fastapi`라는 이름을 붙임 (태그를 안 쓰면 `fastapi:latest`)
- 맨 끝 `.`: "Dockerfile과 복사할 파일들이 **이 폴더**에 있다"는 뜻. 빼먹으면 에러
- 끝나면 `docker images`에 `fastapi`가 보인다

### ② 실행: 이미지 → 컨테이너
```bash
docker run -d --rm -p 9000:8000 --name api fastapi
```

| 옵션 | 의미 |
|---|---|
| `-p 9000:8000` | 내 PC 9000번으로 들어온 요청을 컨테이너 8000번으로 넘김 |
| `-d` | 백그라운드로 실행하고 터미널은 바로 돌려줌 |
| `--rm` | 컨테이너가 멈추면 알아서 지움 (멈춘 컨테이너가 쌓이지 않음) |
| ➕ `--name api` | 이름 지정. 안 하면 `elated_wright` 같은 랜덤 이름이 붙는다 |

### 포트 매핑 이해하기 ⭐
```
-p 9000:8000

브라우저 ──▶ localhost:9000 ──▶ 컨테이너 8000 ──▶ uvicorn --port 8000
            (내 컴퓨터)           (컨테이너 내부)
```
> ⚠️ **오른쪽 포트는 반드시 Dockerfile `CMD`의 `--port` 값과 같아야 한다.**
> 다르면 브라우저에 `ERR_CONNECTION_RESET`(연결이 재설정됨)이 뜬다. (실습 중 직접 겪음)

### 자주 쓰는 명령어

| 하고 싶은 것 | 명령어 |
|---|---|
| 내 PC에 있는 이미지 보기 | `docker images` |
| 지금 돌고 있는 컨테이너 보기 | `docker ps` |
| ➕ 멈춘 것까지 전부 보기 | `docker ps -a` |
| 컨테이너 끄기 | `docker stop <이름 or ID>` |
| 꺼진 컨테이너 지우기 | `docker rm <이름 or ID>` |
| ➕ 로그 보기 (에러 확인 1순위) | `docker logs -f <이름>` |
| ➕ 실행 중인 컨테이너 안으로 들어가기 | `docker exec -it <이름> bash` |
| ➕ 이미지 지우기 | `docker rmi <이미지>` |
| ➕ 멈춘 컨테이너 한 번에 정리 | `docker container prune` |
| ➕ Docker 디스크 사용량 보기 | `docker system df` |

> 💡 ID는 앞 몇 글자만 써도 된다. (`docker stop 3f2a`)

### ⚠️ 코드를 고쳤는데 반영이 안 될 때
이미지는 **빌드한 시점의 스냅샷**이다. Dockerfile이나 코드를 수정했다면 **다시 빌드**해야 한다.
```bash
docker build -t fastapi .
```
(➕ 매번 빌드하기 싫다면 볼륨으로 코드를 연결하는 방법이 있다 → 6장 참고)

---

## 5. Docker Compose up / down

### 왜 필요할까?
과제처럼 FastAPI + MySQL만 써도 컨테이너가 2개다. 서비스가 커지면 캐시 서버, 웹 서버, AI 추론 서버까지 붙는다.
이걸 `docker run`으로 하나씩 띄우면,
- 매번 긴 옵션(포트, 환경변수, 이름…)을 다 쳐야 하고
- DB가 먼저 떠야 API가 붙을 수 있는 등 **순서**를 신경 써야 하고
- 컨테이너끼리 통신하려면 **네트워크**도 직접 만들어야 한다

### Docker Compose
여러 컨테이너의 실행 설정을 **`docker-compose.yml` 한 파일에 적어 두고**, 명령어 한 줄로 한꺼번에 켜고 끄는 도구.
- `docker run` 옵션들을 YAML로 옮겨 적은 것이라고 보면 된다
- 같은 파일 안의 서비스들은 **자동으로 같은 네트워크**에 묶인다
- 파일을 공유하면 팀원도 똑같은 구성을 그대로 띄울 수 있다

### 수업 실습 compose (컨테이너 1개)
```yaml
services:
  api:
    image: fastapi:latest   # 미리 docker build -t fastapi . 로 만든 이미지
    pull_policy: never      # Docker Hub에서 찾지 말고 내 PC 이미지만 사용
    ports:
      - "9000:8000"
```
`docker run -p 9000:8000 fastapi`를 파일로 옮긴 것과 같다.

### 팀 과제처럼 API + DB를 함께 띄우면
```yaml
services:
  api:
    build: .                # 이 폴더의 Dockerfile로 이미지를 만들어서 사용
    ports:
      - "8000:8000"
    depends_on:
      - mysql               # mysql 컨테이너를 먼저 띄움

  mysql:
    image: mysql:8.0        # 공식 이미지를 그대로 사용
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}   # .env 값 사용
      MYSQL_DATABASE: ${DB_NAME}
    ports:
      - "3306:3306"
```

| 키 | 의미 |
|---|---|
| `services` | 띄울 컨테이너 목록. 그 아래 이름(`api`, `mysql`)은 내가 정한다 |
| `build` | Dockerfile로 이미지를 **직접 만들어서** 사용 |
| `image` | **이미 있는 이미지**를 가져다 사용 |
| `ports` | `docker run -p`와 같음 |
| `depends_on` | 어떤 서비스를 먼저 띄울지 |
| `environment` | 컨테이너에 넘길 환경변수 |

### ⚠️ YAML 작성 시 주의
- **들여쓰기는 스페이스**로 (탭 X)
- `ports`는 **목록**이라 `- `(하이픈 + 공백)이 필요하다
  ```yaml
  ports:
    - "9000:8000"   # ✅
    -9000:8000      # ❌ "ports must be a array" 에러
  ```
- 포트는 따옴표로 감싸는 습관을 들이자

### ➕ `build: .` vs `image:`
- `build: .` → `docker compose up` 할 때 Dockerfile로 이미지를 만든다. 코드 수정 후에는 `docker compose up --build`
- `image: fastapi:latest` → 미리 `docker build -t fastapi .`로 만든 이미지를 쓴다. Dockerfile을 바꿨다면 **직접 다시 빌드**해야 한다
- 내가 만든 이미지라면 `build: .`가 편하다

### ➕ 서비스 이름 = 접속 주소
Compose는 서비스끼리 **자동으로 네트워크**를 만들어 준다. 그래서 api 컨테이너에서 DB에 접속할 때 `localhost`가 아니라 **서비스 이름**을 쓴다.
```python
DATABASE_URL = "mysql+asyncmy://user:pw@mysql:3306/ai_health"
#                                       ^^^^^ 서비스 이름
```
> 컨테이너 안에서 `localhost`는 **그 컨테이너 자기 자신**을 뜻한다.

### up / down

| 하고 싶은 것 | 명령어 |
|---|---|
| 전부 켜기 (로그가 터미널에 계속 찍힘, `Ctrl+C`로 종료) | `docker compose up` |
| 전부 켜고 터미널은 돌려받기 | `docker compose up -d` |
| 로그 따라 보기 | `docker compose logs -f` |
| 전부 끄고 **컨테이너까지 삭제** | `docker compose down` |
| ➕ 이미지 다시 빌드하고 켜기 | `docker compose up --build` |
| ➕ 특정 서비스만 켜기 | `docker compose up -d mysql` |
| ➕ 상태 확인 | `docker compose ps` |
| ➕ 끄기만 (삭제 X, `start`로 다시 켬) | `docker compose stop` |
| ➕ 컨테이너 + **볼륨까지 삭제** (DB 데이터 사라짐 ⚠️) | `docker compose down -v` |

> 💡 `up`↔`down`, `start`↔`stop`으로 짝지어 외우면 편하다. `down`은 지우고, `stop`은 멈추기만 한다.
> `docker compose` 명령은 **`docker-compose.yml`이 있는 폴더**에서 실행해야 한다. 없으면 `no configuration file provided` 에러.

---

## 6. ➕ 더 학습하면 좋은 내용

### ① 볼륨 (Volume): 데이터 유지하기
`docker compose down`은 컨테이너를 지우기 때문에, 컨테이너 **안에만** 저장된 DB 데이터는 같이 날아간다.
볼륨은 데이터 폴더를 컨테이너 **바깥**에 따로 보관해서, 컨테이너를 새로 만들어도 데이터가 남게 한다.
```yaml
services:
  mysql:
    image: mysql:8.0
    volumes:
      - mysql_data:/var/lib/mysql   # MySQL이 데이터를 저장하는 폴더를 볼륨에 연결

volumes:
  mysql_data:
```

### ② 볼륨으로 코드 동기화 (개발용)
내 폴더를 컨테이너 `/app`에 연결하면, 코드를 고칠 때마다 다시 빌드하지 않아도 된다. (`--reload`와 함께 쓰기)
```yaml
services:
  api:
    build: .
    volumes:
      - .:/app
```

### ③ `.env`로 비밀번호 분리하기
비밀번호를 yml에 직접 쓰지 않고 `.env`에서 읽어온다. (`.env`는 `.gitignore`에 추가)
```yaml
  mysql:
    image: mysql:8.0
    env_file:
      - .env
```
> 팀 프로젝트에서 MySQL 컨테이너가 `Exited (1)`로 꺼졌던 이유가 `.env`가 없어서였다.

### ④ `depends_on`의 한계
`depends_on`은 **실행 순서만** 보장하고, DB가 **접속 가능한 상태**가 될 때까지 기다려 주지는 않는다. 그래서 API가 DB보다 먼저 접속을 시도해 에러가 날 수 있다. → `healthcheck` + `condition: service_healthy`로 해결

### ⑤ 이후 강의 내용 미리보기
- **FastAPI + MySQL 연결** (pymysql, SQLAlchemy)
- **Redis + Worker**: LLM 모델 동시 요청 문제를 Queue로 해결
- `docker compose up --scale worker=2`: 같은 컨테이너를 여러 개 띄우기

---

## 7. 🛠️ 실습하며 만난 에러 모음

| 에러 | 원인 | 해결 |
|---|---|---|
| `exec: "unvicorn": executable file not found` | CMD 오타 | `uvicorn`으로 고치고 **다시 빌드** |
| `services.api.ports must be a array` | `-9000:8000` (하이픈 뒤 공백 없음) | `- "9000:8000"` |
| 브라우저 `ERR_CONNECTION_RESET` | compose는 `9000:8000`, CMD는 `--port 8003` → 포트 불일치 | 오른쪽 포트를 CMD `--port`와 같게 맞추기 |
| `no configuration file provided` | `docker-compose.yml`이 없는 폴더에서 실행 | yml이 있는 폴더로 이동 |
| MySQL 컨테이너 `Exited (1)` | `.env`가 없어 root 비밀번호 미지정 | `.env` 생성 후 다시 실행 |
| 코드를 고쳤는데 그대로 | 이미지는 빌드 시점의 스냅샷 | `docker build` 또는 `docker compose up --build` |

> 💡 에러가 나면 먼저 `docker ps -a`로 상태를 보고, `docker logs <컨테이너>`로 로그를 확인하자.

---

## ✅ 한 줄 요약
- **Dockerfile**: 실행 환경을 정의하는 레시피
- **Image**: Dockerfile로 만든 틀 (`docker build`)
- **Container**: 이미지를 실행한 프로세스 (`docker run`)
- **Docker Compose**: 여러 컨테이너를 YAML 하나로 관리 (`docker compose up / down`)
