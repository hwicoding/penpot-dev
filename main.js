// [수정] 파일 전체가 Penpot API의 'mutations' 엔드포인트를 사용하도록 변경되었습니다.
// =============================================================================
// 이 스크립트는 펜팟 프로젝트 파일에 여러 요소를 자동으로 생성합니다.
// =============================================================================

// dotenv 라이브러리를 불러옵니다. 개발 환경에서 .env 파일을 사용하기 위함입니다.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// HTTP 요청을 보내기 위한 axios 라이브러리를 불러옵니다.
const axios = require('axios');

// =============================================================================
// 환경 변수에서 필요한 정보들을 가져옵니다.
// .env 파일 또는 깃허브 Secrets에 저장된 값입니다.
// =============================================================================
const PENPOT_ACCESS_TOKEN = process.env.PENPOT_ACCESS_TOKEN; // Penpot 개인 액세스 토큰
const FILE_ID = process.env.FILE_ID; // 디자인 파일의 고유 ID
const PAGE_ID = process.env.PAGE_ID; // 디자인 파일 내 페이지의 고유 ID

// =============================================================================
// API 호출 함수: 여러 사각형을 생성하고 오류를 처리합니다.
// =============================================================================
async function createElements() {
  // [수정] Penpot 객체 생성을 위한 공식 'mutations' 엔드포인트 주소로 변경되었습니다.
  const API_URL = `https://design.penpot.app/api/v1/mutations`;

  /**
   * @description API 요청 시 헤더에 포함될 정보입니다.
   * @property {'Content-Type'} - 요청 본문의 데이터 형식을 지정합니다. (JSON)
   * @property {'Authorization'} - 개인 액세스 토큰을 이용해 사용자 인증을 처리합니다.
   */
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}`,
  };

  // 생성할 사각형 객체들을 담을 배열입니다.
  const rectangles = [];
  for (let i = 0; i < 5; i++) {
    // 0.0 ~ 1.0 사이의 값으로 색상 변경을 위해 사용됩니다.
    const colorValue = i / 4.0;
    // 각 사각형이 겹치지 않도록 x 좌표를 조절합니다.
    const xPosition = 50 + i * 120;

    // Penpot API가 요구하는 형식에 맞는 사각형 데이터 객체입니다.
    const rectangleData = {
      name: `자동 생성 사각형 ${i + 1}`, // 객체의 이름
      type: 'rectangle', // 객체의 타입
      visible: true, // 화면에 보이게 할지 여부
      x: xPosition, // x 좌표
      y: 100, // y 좌표
      width: 100, // 너비
      height: 100, // 높이
      // [수정] Penpot API 형식에 맞게 fill color 구조를 수정했습니다.
      fills: [
        {
          type: 'solid',
          visible: true,
          color: {
            r: colorValue * 255, // r, g, b 값은 0-255 사이의 정수여야 합니다.
            g: (1.0 - colorValue) * 255,
            b: 128,
            a: 1.0,
          },
        },
      ],
      // [추가] 테두리(stroke) 속성을 추가하여 시각적으로 더 잘 보이게 합니다.
      strokes: [
        {
          type: 'solid',
          visible: true,
          strokeWidth: 2,
          color: { r: 0, g: 0, b: 0, a: 1.0 },
        },
      ],
    };
    rectangles.push(rectangleData);
  }

  /**
   * @description Penpot API의 'mutations' 엔드포인트에 보낼 최종 데이터입니다.
   * @property {string} type - 'add-object'는 객체를 추가하는 명령입니다.
   * @property {string} 'file-id' - 객체를 추가할 파일의 ID입니다.
   * @property {string} 'page-id' - 객체를 추가할 페이지의 ID입니다.
   * @property {Array<Object>} objects - 추가할 객체들의 배열입니다.
   */
  const mutationData = {
    type: 'add-object',
    'file-id': FILE_ID,
    'page-id': PAGE_ID,
    objects: rectangles,
  };

  try {
    console.log('펜팟 페이지에 여러 사각형을 생성합니다...');
    // [수정] 한번의 API 호출로 모든 사각형 데이터를 전송합니다.
    await axios.post(API_URL, mutationData, { headers });
    console.log('✅ 모든 사각형이 성공적으로 생성되었습니다!');
  } catch (error) {
    console.error('❌ API 호출 중 오류 발생:', error.message);
    if (error.response) {
      console.error('오류 응답 상태:', error.response.status);
      console.error('오류 응답 데이터:', error.response.data);
    }
    // 오류 발생 시 GitHub Action이 실패하도록 프로세스를 종료합니다.
    process.exit(1);
  }
}

// 스크립트의 메인 함수를 실행합니다.
createElements();
