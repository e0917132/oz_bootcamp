# Git / Github 기본 개념 정리 (2)


## 1. GitHub 기초

#### 1-1. 원격 저장소와 Git Remote

- GitHub는 Git 저장소를 인터넷에 올려두는 호스팅 서비스이다. GitHub에서 새 Repository를 생성하면 다음과 같은 원격 주소(URL)가 발급된다.

```python
HTTPS : [https://github.com/사용자명/저장소명.git]
SSH   : [git@github.com](mailto:git@github.com):사용자명/저장소명.git
```

- 원격 저장소의 역할

| 역할 | 설명 |
| --- | --- |
| 공유 | 여러 사람이 같은 코드를 내려받고 올림 |
| 백업 | 내 컴퓨터가 고장나도 코드가 남아 있음 |
| 협업의 기준점 | “팀의 정답 코드”가 어디 있는지 명확해짐 |

```python
git remote add origin https://github.com/me/my-repo.git   # 원격 저장소 등록
git remote -v                                             # 등록된 원격 저장소 확인
```

- **`origin`은 예약어가 아니라 별명(alias)**이다. 긴 URL 대신 쓰는 이름이고, 관례상 "내가 clone/등록한 기본 원격 저장소"를 `origin`이라 부른다.
- `git remote -v`는 fetch용/push용 주소를 각각 보여준다. 보통 둘이 같다.
- 주소를 잘못 등록했다면 `git remote set-url origin 새주소`, 삭제는 `git remote remove origin`.

> 💡 **인증 주의**: GitHub는 2021년부터 HTTPS push 시 **계정 비밀번호를 받지 않는다.** 대신 **Personal Access Token(PAT)** 이나 **SSH 키**를 사용해야 한다. 처음 push할 때 비밀번호 오류가 난다면 대부분 이 이유다. (macOS는 `gh auth login`으로 GitHub CLI를 통해 로그인하면 간편하다.)
> 

---

#### 1-2. `git push` / `git pull`

- 로컬과 원격 저장소를 동기화하는 명령어

```python
git push -u origin main   # 로컬 main의 커밋을 origin으로 업로드 -> 주로 Branch를 push
git pull                  # 원격의 변경 사항을 내려받아 로컬에 반영 -> 주로 main을 pull
```

<aside>
💡

**`u` (`-set-upstream`) 옵션의 의미**

- "로컬 `main` 브랜치는 앞으로 `origin/main`과 짝이다"라고 **추적(tracking) 관계**를 설정한다.
- 한 번만 지정하면 이후에는 `git push`, `git pull`만 입력해도 된다.
</aside>

- **`git pull` = `git fetch` + `git merge`**

| **명령어** | **하는 일** |
| --- | --- |
| `git fetch` | 원격의 최신 커밋을 **가져오기만** 함 (내 작업 파일은 그대로) |
| `git merge origin/main` | 가져온 내용을 현재 브랜치에 합침 |
| `git pull` | 위 두 동작을 한 번에 |

→ 원격에 무엇이 바뀌었는지 먼저 보고 싶다면 `git fetch` 후 `git log main..origin/main`으로 확인하고 합치는 습관이 안전하다.

---

## 2. 협업 실습

#### 2-1. Clone vs Fork

| **구분** | **Clone** | **Fork** |
| --- | --- | --- |
| 어디로 복사? | 원격 → **내 컴퓨터(로컬)** | 남의 GitHub 저장소 → **내 GitHub 계정** |
| 수행 위치 | 터미널 (`git clone`) | GitHub 웹 (Fork 버튼) |
| 원본에 push 권한 | 있음 | 없음 |
| 주 사용처 | 팀 내부 협업 | 오픈소스 기여 |

핵심: **Fork와 Clone은 대립 관계가 아니라 순서 관계**인 경우가 많다. Fork(서버에서 서버로 복사) → Clone(내 Fork를 로컬로 복사)의 순서로 함께 쓰인다.

---

### **2-2. Pull Request (PR)**

**"내 브랜치의 변경 사항을 대상 브랜치에 합쳐 주세요"라고 요청**하는 GitHub 기능이다. (이름이 push가 아니라 *pull*인 이유: 저장소 관리자 입장에서 "내 변경을 당겨(pull) 가 주세요"라는 요청이기 때문이다.)

- 좋은 PR의 구성
1. **제목**: 무엇을 했는지 한 줄로 (`Add login API`)
2. **본문**: 왜 바꿨는지, 어떻게 테스트했는지, 관련 Issue 번호
3. **리뷰어 지정**
4. **작게 나누기**: 한 PR = 한 기능. 변경이 클수록 리뷰 품질이 떨어진다.

- PR 병합 방식 (GitHub의 Merge 버튼 옵션)

| **방식** | **결과** |
| --- | --- |
| Create a merge commit | 브랜치의 모든 커밋 + 병합 커밋을 그대로 보존 |
| Squash and merge | 브랜치의 커밋들을 **하나로 압축**해서 병합 (히스토리가 깔끔) |
| Rebase and merge | 병합 커밋 없이 커밋들을 일렬로 붙임 |

> 💡 아직 작업 중이라면 **Draft Pull Request**로 올려서 "리뷰 준비 전"임을 표시할 수 있다. PR이 열린 상태에서 같은 브랜치에 추가로 push하면 **PR에 자동으로 반영된**다. PR을 새로 만들 필요가 없다.
> 

---

### **2-3. Code Review 기본**

리뷰어는 PR에서 세 가지 중 하나로 응답한다.

- **Comment**: 의견만 남김
- **Approve**: 병합해도 좋다고 승인
- **Request changes**: 수정이 필요함 (수정 전에는 병합 보류)

리뷰 원칙 (교안 내용 + 보충)

- **사람이 아니라 코드를 리뷰**한다. ("당신이 틀렸다" ✕ → "이 부분은 null일 때 에러가 날 것 같아요" ○)
- **이유를 남긴다.** "이렇게 바꾸세요"보다 "~한 이유로 이렇게 하면 어떨까요?"가 팀 규칙 공유에 도움이 된다.
- **승인 후 병합.** Branch protection rule로 "승인 N개 이상이어야 병합 가능"을 강제할 수 있다(2-6 참고).

---

### **2-4. Issue 사용법**

할 일, 버그 리포트, 기능 요청 등을 **번호가 붙은 게시글**로 관리하는 기능이다. `#번호`로 어디서든 참조할 수 있습니다.

**PR과 Issue 연결 — 자동 닫기 키워드**

PR 본문(또는 커밋 메시지)에 다음 키워드를 쓰면, PR이 **기본 브랜치(main)에 병합될 때 해당 Issue가 자동으로 닫힌다.**

```
Closes #12
Fixes #12
Resolves #12
```

- 사용 가능한 키워드: `close/closes/closed`, `fix/fixes/fixed`, `resolve/resolves/resolved`
- 단순히 `#12`만 적으면 링크만 걸리고 자동으로 닫히지는 않는다.

**Issue → Pull Request → Code Review 흐름 도식화**

```python
 [1. Issue 생성] ──▶ [2. 브랜치 작업] ──▶ [3. Pull Request]
   #12 등록            commit → push        Closes #12
                            ▲                    │
                            │ Request changes    ▼
                            └─────────────── [4. 코드 리뷰]
                                                 │ Approve
                                                 ▼
 [6. Issue #12 자동 종료] ◀──────────────── [5. main에 병합]
```

---

### **2-5. 협업 방식 ① Fork & Clone (오픈소스 방식)**

원본 저장소에 **push 권한이 없을 때**의 흐름이다. 교안 1~6단계 이후의 과정까지 이어서 정리하면:

```
# 1. (GitHub) Issue 생성 – 무엇을 할지 먼저 공유
# 2. (GitHub) 원본 저장소를 내 계정으로 Fork

# 3. 내 Fork를 로컬로 Clone  → 자동으로 origin = 내 Fork
git clone https://github.com/나/repo.git
cd repo

# 4. 원본 저장소를 upstream이라는 이름으로 추가 등록
git remote add upstream https://github.com/원작자/repo.git
git remote -v   # origin(내 Fork), upstream(원본) 두 개가 보여야 함

# 5. 원본의 최신 코드 받기
git pull upstream main

# 6. 작업 브랜치 생성 (-c: 만들면서 바로 이동)
git switch -c feature/add-my-name

# ---- 교안 이후 단계 ----
# 7. 수정 후 커밋
git add .
git commit -m "Add my name to contributors"

# 8. 내 Fork(origin)에 push  ※ upstream에는 권한이 없음
git push -u origin feature/add-my-name

# 9. (GitHub) 내 Fork의 feature/add-my-name → 원본의 main 으로 PR 생성
```

**origin vs upstream 정리**

| **이름** | **가리키는 곳** | **하는 일** |
| --- | --- | --- |
| `origin` | 내 Fork | 내 작업을 push |
| `upstream` | 원본 저장소 | 최신 코드를 pull (읽기 전용) |

> 💡 Fork는 원본이 업데이트돼도 **자동으로 따라가지 않는다.** 주기적으로 `git pull upstream main` 후 `git push origin main`으로 맞춰 주거나, GitHub 웹의 **Sync fork** 버튼을 사용해야 한다.
> 

---

### **2-6. 협업 방식 ② Collaborator (팀 내부 방식)**

팀원이 **같은 저장소에 직접 push 권한**을 가지는 흐름이다.

1. **Collaborator 등록**: 저장소 Settings → Collaborators → 팀원 초대 (초대받은 사람이 수락해야 함)
2. **Branch protection rule 추가**: Settings → Branches(또는 Rules) → `main` 대상
    - **Require a pull request before merging** 체크 → `main`에 직접 push 금지, 반드시 PR을 거치게 함
    - 필요하면 "Require approvals"로 최소 승인 수 지정
3. **Clone**: `git clone 원본_저장소_URL` (Fork 없음)
4. **브랜치 생성 & 커밋**
    
    ```
    git switch -c feature/mybranch
    git add .
    git commit -m "Add signup form"
    ```
    
5. **원격 브랜치에 push**: `git push origin feature/mybranch`
6. **PR 생성**: GitHub에서 `feature/mybranch → main`

**병합 이후 정리 (교안 이후 단계)**

```
git switch main
git pull                          # 병합된 최신 main 받기
git branch -d feature/mybranch    # 로컬 작업 브랜치 삭제
```

> 💡 왜 main 보호가 중요한가? 보호 규칙이 없으면 누군가 실수로 `main`에 바로 push하거나 강제 push(`--force`)로 이력을 덮어쓸 수 있다. "main은 항상 배포 가능한 상태"를 지키는 장치다.
> 

---

## **3. 자주 사용하는 명령어**

먼저 알아둘 표기법:

| **표기** | **의미** |
| --- | --- |
| `HEAD` | 현재 브랜치의 최신 커밋 |
| `HEAD~1` (= `HEAD^`) | 그 바로 이전 커밋 |
| `HEAD~3` | 세 커밋 전 |
| 커밋 해시 | `git log --oneline`에 나오는 `a1b2c3d` 같은 값 (앞 7자리만 써도 됨) |

### **3-1. `git show` — 커밋 하나 자세히 보기**

```
git show              # = git show HEAD, 최신 커밋
git show a1b2c3d      # 특정 커밋
git show HEAD~2       # 두 커밋 전
git show --stat HEAD  # 변경 내용 대신 "어떤 파일이 몇 줄 바뀌었는지"만
```

출력: 커밋 해시, 작성자, 날짜, 메시지, 그리고 변경 내용(diff).

### **3-2. `git diff` — 두 상태의 차이 비교**

Git의 세 영역(Working Directory → Staging Area → HEAD) 중 **어디와 어디를 비교하는지**가 핵심이다.

| **명령어** | **비교 대상** | **언제 쓰나** |
| --- | --- | --- |
| `git diff` | Working Directory ↔ Staging Area | 아직 `add` 안 한 변경 확인 |
| `git diff --staged` (= `--cached`) | Staging Area ↔ HEAD | **커밋 직전 최종 점검** |
| `git diff HEAD` | Working Directory ↔ HEAD | add 여부와 무관하게 전체 변경 |
| `git diff HEAD~1 HEAD` | 커밋 ↔ 커밋 | 마지막 커밋에서 바뀐 것 |
| `git diff main feature` | 브랜치 ↔ 브랜치 | 병합 전 차이 확인 |

> ⚠️ 자주 하는 착각: `git add`를 한 뒤 `git diff`를 치면 **아무것도 안 나온다.** 이미 스테이징으로 올라갔기 때문이다. 이때는 `git diff --staged`.
> 

읽는 법: `-`로 시작하는 줄은 삭제, `+`로 시작하는 줄은 추가.

### **3-3. `git blame` — 이 줄은 누가 언제 바꿨나**

```
git blame main.py            # 파일 전체
git blame -L 10,20 main.py   # 10~20번째 줄만
```

각 줄 앞에 `커밋해시 (작성자 날짜 줄번호)`가 붙어 나온다. 의심스러운 줄의 해시를 `git show 해시`로 이어서 보면 "왜 이렇게 바뀌었는지" 커밋 메시지까지 확인할 수 있다. GitHub 웹에서도 파일 화면의 **Blame** 버튼으로 같은 내용을 볼 수 있다.

> 이름은 "비난"이지만 범인 찾기가 목적이 아니라 **맥락 찾기** 도구이다.
> 

### **3-4. `git stash` — 작업 임시 보관**

상황 예시: 기능 개발 중에 "main에 긴급 버그!" → 아직 커밋하기엔 어중간한 코드가 있음 → 브랜치를 옮기려니 변경 사항이 걸림.

```
git stash                    # 변경 사항을 서랍에 넣고 작업 폴더를 깨끗하게
git stash push -m "로그인 폼 작업 중"   # 메모를 붙여서 저장 (추천)
git switch main              # 긴급 수정 진행...
git switch feature/login
git stash list               # stash@{0}: On feature/login: 로그인 폼 작업 중
git stash pop                # 꺼내서 적용 + 목록에서 삭제
```

| **명령어** | **적용** | **목록에서 삭제** |
| --- | --- | --- |
| `git stash pop` | O | O |
| `git stash apply` | O | X (여러 브랜치에 같은 내용 적용할 때) |
| `git stash apply stash@{1}` | 특정 stash 적용 | X |
| `git stash drop stash@{1}` | X | 특정 stash 삭제 |

> ⚠️ 기본 `git stash`는 **새로 만든(Untracked) 파일은 저장하지 않는다.** 새 파일까지 넣으려면 `git stash -u`. stash는 임시 보관함이다. 오래 묵히면 무엇이었는지 잊어버리니 가능하면 짧게 쓸 것.
> 

### **3-5. `git reset` — 브랜치를 과거로 되돌리기**

`reset`은 **현재 브랜치(HEAD)가 가리키는 커밋 자체를 뒤로 옮긴다.** 즉 히스토리를 바꾼다. 세 옵션의 차이는 "HEAD를 옮기면서 **스테이징과 파일까지 같이 되돌리느냐**"이다.

| **옵션** | **HEAD(커밋)** | **Staging Area** | **Working Directory(파일)** | **결과** |
| --- | --- | --- | --- | --- |
| `--soft` | 되돌림 | 유지 | 유지 | 커밋만 취소, 바로 다시 커밋 가능 |
| `--mixed` (기본값) | 되돌림 | 되돌림 | 유지 | 커밋 + add 취소, 수정한 파일은 남음 |
| `--hard` | 되돌림 | 되돌림 | **되돌림** | 변경 내용까지 **삭제** |

```
git reset --soft HEAD~1   # "커밋 메시지 잘못 썼네/파일 하나 빠졌네" → 다시 커밋
git reset HEAD~1          # (= --mixed) 커밋을 풀고 add부터 다시
git reset --hard HEAD~1   # 마지막 커밋과 그 변경을 통째로 버림
```

> ⚠️ **이미 push한 커밋에는 reset을 쓰지 말 것.** 원격에는 그 커밋이 남아 있어서 다음 push가 거절되고, 억지로 `git push --force`를 하면 그 커밋을 받아간 팀원들의 히스토리와 어긋난다. 공유된 커밋을 되돌릴 때는 다음의 `revert`를 사용한다.
> 
> 
> 💡 `--hard`로 날린 **커밋**은 `git reflog`로 대부분 복구할 수 있다. 단, 한 번도 커밋/스테이징하지 않은 수정 내용은 복구할 수 없다.
> 

### **3-6. `git revert` — 되돌리는 커밋을 새로 만들기**

```
git revert a1b2c3d     # a1b2c3d의 변경을 정반대로 적용한 "새 커밋" 생성
```

- 기존 커밋은 그대로 두고, **"이 커밋을 취소했다"는 기록이 새로 쌓인다.**
- 히스토리를 고치지 않으므로 이미 push된 브랜치에서도 안전하다.

**reset vs revert 한눈에 보기**

```
원래:     A ─ B ─ C (main)          ← C를 없던 일로 하고 싶다

reset:    A ─ B (main)              ← C가 히스토리에서 사라짐
revert:   A ─ B ─ C ─ C' (main)     ← C'가 C의 변경을 상쇄
```

|  | **`git reset`** | **`git revert`** |
| --- | --- | --- |
| 히스토리 | 바꿈(삭제) | 보존(추가) |
| 사용 시점 | push 전, 혼자 쓰는 브랜치 | push 후, 공유된 브랜치 |
| 협업 안전성 | 낮음 | 높음 |

> 💡 병합 커밋을 revert할 때는 어느 쪽 부모를 기준으로 할지 지정해야 한다: `git revert -m 1 병합커밋해시`
> 

### **3-7. `git commit --amend` — 마지막 커밋 고치기**

```
# 메시지만 수정
git commit --amend -m "Fix password validation bug"

# 빠뜨린 파일 추가 (메시지는 그대로)
git add forgotten.py
git commit --amend --no-edit
```

> ⚠️ amend는 "기존 커밋 수정"처럼 보이지만 실제로는 **새 커밋(새 해시)으로 교체**하는 것이다. 그래서 reset과 마찬가지로 **이미 push한 커밋에는 쓰지 않는 것**이 원칙이다.
> 

**정리 — 히스토리를 바꾸는 명령어 vs 보존하는 명령어**

| **히스토리를 바꿈 (push 전에만)** | **히스토리를 보존 (push 후에도 OK)** |
| --- | --- |
| `reset`, `commit --amend`, `rebase` | `revert`, `merge` |

---

#### 참고. 하루 협업 루틴 요약

```python
git switch main
git pull                              # 1. 최신 코드 받기
git switch -c feature/작업명           # 2. 작업 브랜치 생성
# ... 코드 작업 ...
git status                            # 3. 상태 확인
git diff                              # 4. 변경 내용 점검
git add .
git diff --staged                     # 5. 커밋 직전 최종 점검
git commit -m "feat: 작업 내용"         # 6. 커밋
git push -u origin feature/작업명      # 7. 원격에 올리기
# 8. GitHub에서 PR 생성 → 리뷰 → 승인 → 병합
git switch main && git pull           # 9. 병합 결과 받기
git branch -d feature/작업명           # 10. 브랜치 정리
```

---
