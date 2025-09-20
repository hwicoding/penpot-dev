const axios = require('axios');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// 환경 변수에서 펜팟 API 토큰을 가져오기
const PENPOT_ACCESS_TOKEN = process.env.PENPOT_ACCESS_TOKEN;

// 🚨🚨 .env 파일에서 변수를 가져오기 🚨🚨
const FILE_ID = process.env.FILE_ID;
const PAGE_ID = process.env.PAGE_ID;

// API 요청을 보내는 함수
async function createElements() {
  const API_URL = `https://design.penpot.app/api/v1/files/${FILE_ID}/pages/${PAGE_ID}/elements`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}`,
  };

  const requests = [];

  // 🚨 5개의 다른 색깔 사각형을 생성하는 반복문 🚨
  for (let i = 0; i < 5; i++) {
    const color = i / 4.0; // 0.0, 0.25, 0.5, 0.75, 1.0
    const xPosition = 50 + i * 120; // 50px씩 떨어진 위치에 배치

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
            r: color,
            g: 1.0 - color,
            b: 0.5,
            a: 1.0,
          },
        },
      ],
    };
    // 요청 배열에 API 호출을 추가합니다.
    requests.push(axios.post(API_URL, rectangleData, { headers }));
  }

  try {
    console.log('펜팟 페이지에 여러 사각형을 생성합니다...');
    // Promise.all을 사용해 모든 요청을 병렬로 처리합니다.
    await Promise.all(requests);
    console.log('✅ 모든 사각형이 성공적으로 생성되었습니다!');
  } catch (error) {
    console.error('❌ API 호출 중 오류 발생:', error.message);
    if (error.response) {
      console.error('오류 응답 데이터:', error.response.data);
    }
  }
}

// 함수 실행
createElements();
