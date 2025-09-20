// =============================================================================
// 이 스크립트는 펜팟 프로젝트 파일에 여러 요소를 자동으로 생성합니다.
// =============================================================================

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const axios = require('axios');

// =============================================================================
// 환경 변수에서 필요한 정보들을 가져옵니다.
// .env 파일 또는 깃허브 Secrets에 저장된 값입니다.
// =============================================================================
const PENPOT_ACCESS_TOKEN = process.env.PENPOT_ACCESS_TOKEN;
const PROJECT_ID = process.env.PROJECT_ID;
const FILE_ID = process.env.FILE_ID;
const PAGE_ID = process.env.PAGE_ID;

// =============================================================================
// API 호출 함수: 여러 사각형을 생성하고 오류를 처리합니다.
// =============================================================================
async function createElements() {
  const API_URL = `https://design.penpot.app/api/v1/projects/${PROJECT_ID}/files/${FILE_ID}/pages/${PAGE_ID}/elements`;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}`,
  };

  const requests = [];
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
createElements();
