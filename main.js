// =============================================================================
// 이 스크립트는 펜팟 프로젝트 파일에 여러 요소를 자동으로 생성합니다.
// 깃허브 액션과 로컬에서 모두 사용할 수 있도록 설계되었습니다.
// =============================================================================

// 로컬에서 .env 파일을 사용하기 위한 dotenv 라이브러리를 불러옵니다.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// HTTP 요청을 보내기 위한 axios 라이브러리를 불러옵니다.
const axios = require('axios');

// =============================================================================
// 환경 변수에서 필요한 정보들을 가져옵니다.
// .env 파일 또는 깃허브 Secrets에 저장된 값입니다.
// =============================================================================
const PENPOT_ACCESS_TOKEN = process.env.PENPOT_ACCESS_TOKEN;
const PROJECT_ID = process.env.PROJECT_ID;
const FILE_ID = process.env.FILE_ID;
const PAGE_ID = process.env.PAGE_ID;

// =드를 생성하는 API 호출 함수입니다.
async function createElements() {
  // 펜팟 API의 엔드포인트 URL입니다.
  const API_URL = `https://design.penpot.app/api/v1/projects/${PROJECT_ID}/files/${FILE_ID}/pages/${PAGE_ID}/elements`;

  // API 요청 시 필요한 인증 헤더입니다.
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}`,
  };

  // API 요청들을 담을 빈 배열을 생성합니다.
  const requests = [];

  // 5개의 다른 색깔 사각형을 생성하는 반복문입니다.
  for (let i = 0; i < 5; i++) {
    const colorValue = i / 4.0;
    const xPosition = 50 + i * 120;

    const rectangleData = {
      name: `자동 생성 사각형 ${i + 1}`,
      type: 'rectangle',
      visible: true,
      x: xPosition,
      y: 100,
      width: 100,
      height: 100,
      fill: [
        {
          type: 'solid',
          color: {
            r: colorValue,
            g: 1.0 - colorValue,
            b: 0.5,
            a: 1.0,
          },
        },
      ],
    };
    requests.push(axios.post(API_URL, rectangleData, { headers }));
  }

  try {
    console.log('펜팟 페이지에 여러 사각형을 생성합니다...');
    // Promise.all을 사용해 모든 API 요청을 병렬로 처리합니다.
    await Promise.all(requests);
    console.log('✅ 모든 사각형이 성공적으로 생성되었습니다!');
  } catch (error) {
    console.error('❌ API 호출 중 오류 발생:', error.message);
    if (error.response) {
      console.error('오류 응답 데이터:', error.response.data);
    }
    process.exit(1);
  }
}

// 스크립트 실행
createElements();
