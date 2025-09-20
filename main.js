// =============================================================================
// 이 스크립트는 펜팟 API를 사용하여 디자인 파일에 여러 요소를 자동으로 생성합니다.
// 깃허브 액션과 로컬에서 모두 사용할 수 있도록 설계되었습니다.
// =============================================================================

// 로컬에서 .env 파일을 사용하기 위한 dotenv 라이브러리를 불러옵니다.
// 깃허브 액션에서는 이 코드가 실행되지 않고, Secrets를 바로 사용하게 됩니다.
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
const FILE_ID = process.env.FILE_ID; // 초안 파일의 고유 ID
const PAGE_ID = process.env.PAGE_ID; // 요소를 생성할 페이지의 고유 ID

// =============================================================================
// API 호출 함수: 여러 사각형을 생성하고 오류를 처리합니다.
// =============================================================================
async function createElements() {
  // 펜팟 API의 엔드포인트 URL입니다.
  // 초안 파일은 프로젝트 ID가 필요 없으므로 'files'로 바로 접근합니다.
  const API_URL = `https://design.penpot.app/api/v1/files/${FILE_ID}/pages/${PAGE_ID}/elements`;

  // API 요청 시 필요한 인증 헤더입니다.
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}`,
  };

  // API 요청들을 담을 빈 배열을 생성합니다.
  const requests = [];

  // 5개의 다른 색깔 사각형을 생성하는 반복문입니다.
  for (let i = 0; i < 5; i++) {
    // 반복문의 i 값에 따라 동적으로 색상과 위치를 계산합니다.
    const colorValue = i / 4.0; // 0.0, 0.25, 0.5, 0.75, 1.0
    const xPosition = 50 + i * 120; // x 좌표를 120px씩 이동시킵니다.

    // API에 보낼 사각형의 데이터 객체입니다.
    const rectangleData = {
      name: `자동 생성 사각형 ${i + 1}`, // 요소의 이름을 동적으로 설정합니다.
      type: 'rectangle', // 요소의 타입을 'rectangle'로 지정합니다.
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

    // axios.post 호출을 requests 배열에 추가합니다.
    requests.push(axios.post(API_URL, rectangleData, { headers }));
  }

  try {
    console.log('펜팟 페이지에 여러 사각형을 생성합니다...');
    // Promise.all을 사용해 모든 API 요청을 병렬로 처리합니다.
    await Promise.all(requests);
    console.log('✅ 모든 사각형이 성공적으로 생성되었습니다!');
  } catch (error) {
    // API 호출 실패 시 오류를 콘솔에 출력합니다.
    console.error('❌ API 호출 중 오류 발생:', error.message);
    if (error.response) {
      console.error('오류 응답 데이터:', error.response.data);
    }
    // 🚨 이 부분이 매우 중요합니다! 🚨
    // 오류가 발생하면 1을 반환하여 스크립트를 강제 종료합니다.
    // 이로써 깃허브 액션이 '실패(Failed)' 상태를 올바르게 인식하게 됩니다.
    process.exit(1);
  }
}

// 스크립트 실행
createElements();
