# Vercel 배포 설정

파일 구조:
- index.html
- api/openai.js

Vercel 프로젝트 Settings → Environment Variables에서 다음 값을 추가하세요.

- `OPENAI_API_KEY`: 실제 OpenAI API 키 (Secret)
- `OPENAI_MODEL`: 선택 사항. 미설정 시 클라이언트 기본 모델을 사용합니다.

환경변수를 추가/변경한 뒤 새로 배포하세요.

중요: 공개 URL이라면 `/api/openai`가 서버 API 키를 사용하므로 Vercel Deployment Protection 또는 별도 사용자 인증을 권장합니다.
