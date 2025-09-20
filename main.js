const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// 환경 변수에서 펜팟 API 토큰을 가져오기
const PENPOT_ACCESS_TOKEN = process.env.PENPOT_ACCESS_TOKEN;

// 🚨🚨 .env 파일에서 변수를 가져오기 🚨🚨
const FILE_ID = process.env.FILE_ID;
const PAGE_ID = process.env.PAGE_ID;

// 페이지에 사각형을 추가하는 함수
async function addRectangleToPage() {
  // 🚨 API 엔드포인트 URL이 변경되었습니다. 🚨
  const API_URL = `https://design.penpot.app/api/v1/files/${FILE_ID}/pages/${PAGE_ID}/elements`;

  // API 요청 헤더
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}`,
  };

  // 추가할 사각형의 데이터
  const rectangleData = {
    name: `자동 생성 사각형 ${new Date().toLocaleTimeString()}`,
    type: 'rectangle',
    visible: true,
    x: 100,
    y: 100,
    width: 150,
    height: 100,
    fill: [
      {
        type: 'solid',
        color: {
          r: 0.1,
          g: 0.5,
          b: 0.9,
          a: 1.0,
        },
      },
    ],
  };

  try {
    console.log('펜팟 페이지에 사각형을 생성합니다...');
    const response = await axios.post(API_URL, rectangleData, { headers });

    if (response.status === 201) {
      console.log('✅ 사각형이 성공적으로 생성되었습니다!');
      console.log(`요소 이름: ${response.data.name}`);
      console.log(`요소 ID: ${response.data.id}`);
    } else {
      console.error(
        '⚠️ 사각형 생성 실패:',
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error('❌ API 호출 중 오류 발생:', error.message);
    if (error.response) {
      console.error('오류 응답 데이터:', error.response.data);
    }
  }
}

addRectangleToPage();
