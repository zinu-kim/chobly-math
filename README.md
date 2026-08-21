# Chobly Math - 초연이의 수학 문제 생성기

초등학교 5학년 딸(초연이)을 위한 맞춤형 수학 문제 생성 및 풀이 앱입니다.

## 📱 앱 구조

### 부모 앱 (`/parent/`)
- 사진 업로드로 기존 문제 인식
- Claude AI를 활용한 유사 문제 생성
- 공유 코드로 아이에게 문제 전달
- 문제 생성 이력 관리

### 아이 앱 (`/kid/`)
- 부모가 생성한 문제 풀기
- 자동 채점 (1회 재시도 가능)
- 답 형식: 정수, 소수, 분수, 대분수
- 결과 피드백 및 풀이 해설

## 🚀 기술 스택

- **Framework**: PWA (Progressive Web App)
- **Storage**: localStorage
- **Validation**: JavaScript 기반 수학 검증
- **Sharing**: Base64 인코딩된 JSON

## 📋 기능 상세

### 부모 앱 플로우
1. 문제 사진 업로드
2. 사진 확인
3. Claude에 요청 (프롬프트 복사/붙여넣기)
4. 생성된 문제 선택
5. 공유 코드 생성 및 전달

### 아이 앱 플로우
1. 공유 코드 입력
2. 문제 풀기
3. 답안 검증
4. 결과 확인

## 💾 데이터 구조

### 문제 객체
```json
{
  "question": "문제 텍스트",
  "answer": "정답",
  "unit": "단위",
  "type": "integer|decimal|fraction|mixed",
  "explanation": "풀이 과정"
}
```

### 공유 코드 형식
```
CHOBLY-1:{base64-encoded-json}
```

## 📦 배포

GitHub Pages에서 호스팅됩니다.

```
https://zinu-kim.github.io/chobly-math/parent/
https://zinu-kim.github.io/chobly-math/kid/
```

## 🔧 로컬 개발

```bash
# 프로젝트 클론
git clone https://github.com/zinu-kim/chobly-math.git
cd chobly-math

# 로컬 서버 실행
python3 -m http.server 8000

# 브라우저에서 접속
http://localhost:8000/parent/
http://localhost:8000/kid/
```

## 📝 사용 예시

1. 부모님이 초연이의 문제 사진을 찍음
2. 부모 앱에서 사진 업로드 및 Claude에 요청
3. 생성된 문제 중 원하는 것 선택
4. 공유 코드 획득
5. 공유 코드를 초연이에게 전달 (카톡 등)
6. 초연이가 공유 코드 입력
7. 문제 풀이

## 🎨 UI 특징

- 반응형 디자인 (320px ~ 1200px)
- 다크 모드 대응
- 모바일 최적화
- 터치 친화적

## 📞 피드백

개선 사항이나 버그 보고는 이슈를 통해 부탁드립니다.
