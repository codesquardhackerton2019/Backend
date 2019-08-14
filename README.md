# nodejs-news
NodeJS Step 12 news site

## 기획

### 프로젝트 목적

기술 관련 뉴스 사이트입니다.

### 기능

#### 권한

권한은 계층구조로 주어지며, 상위 권한은 하위 권한의 기능을 모두 이용할 수 있습니다. 권한의 종류는 세 가지 입니다.

    - user: 일반 사용자입니다. 댓글 쓰기, 좋아요, 구독 기능을 이용할 수 있습니다.
    - writer: 기사를 쓸 수 있는 사용자입니다. 관리자의 인증을 받아야 합니다. 기사 작성 기능을 사용할 수 있습니다.
    - admin: 관리자입니다. 다른 사용자의 권한을 조정하거나, 악성 사용자를 차단할 수 있습니다.

#### 글

글 쓰기는 마크다운 형식으로 올려야 합니다. 파일을 업로드하거나 마크다운 형식의 텍스트를 복사하여 넣는 방식으로 업로드할 수 있습니다.

#### 댓글

댓글은 로그인한 사용자만 쓸 수 있습니다. 댓글과 관련된 다른 기능은 좋아요, 대댓글 기능이 있습니다. 대댓글의 depth는 최대 1입니다.

#### 구독

사용자는 마음에 드는 기자를 구독 버튼을 눌러 게시글을 추적할 수 있습니다. 

#### 관리자 페이지

관리자는 관리자 페이지에서 사용자를 관리할 수 있습니다. 

### Wireframe

#### 메인 페이지

![main page](/docs/images/news-wireframe-main-page.jpg)

#### 로그인

![signin](/docs/images/news-wireframe-signin.jpg)

#### 회원 가입

![signup](/docs/images/news-wireframe-signup.jpg)

#### 글

![newspage](/docs/images/news-wireframe-newspage.jpg)

#### 댓글

![comment](/docs/images/news-wireframe-comment.jpg)

#### 관리자 페이지

![admin page](/docs/images/news-wireframe-admin-page.jpg)

### DB 구조

![news db arch](/docs/images/news-db.png)

#### 컬렉션

##### user

Key|설명|타입
---|---|---
email|사용자를 식별할 때 사용|String
password|로그인 시 사용할 비밀번호|String
profile_image|사용자의 프로필 사진 Url|String
age|사용자의 나이|Numbers
privilege|사용자의 권한|Integer

##### article

Key|설명|타입
---|---|---
title|글 제목|String
writer_id|작성자의 고유 id|Object Id
body_url|본문 마크다운 파일의 url|String

##### comment

Key|설명|타입
---|---|---
title|댓글 제목|String
comment|댓글 본문|String
writer_id|작성자의 고유 id|Object id
article_id|게시글의 고유 id|Object id
parent_id|대댓글인 경우 상위 댓글의 id|Object id

##### article_like

Key|설명|타입
---|---|---
article_id|게시글의 고유 id|Object id
user_id|좋아요를 누른 사용자의 id|Object id

##### comment_like

Key|설명|타입
---|---|---
comment_id|댓글의 고유 id|Object id
user_id|좋아요를 누른 사용자의 id|Object id

##### subscribe

Key|설명|타입
---|---|---
user_id|사용자의 id|Object id
follow_id|구독을 누른 사람의 id|Object id