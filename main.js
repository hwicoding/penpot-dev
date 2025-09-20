const axios = require('axios');

// 환경 변수에서 펜팟 API 토큰을 가져옵니다.
const PENPOT_ACCESS_TOKEN = process.env.PENPOT_ACCESS_TOKEN;

// 🚨🚨 이 부분을 반드시 수정하세요! 🚨🚨
// 펜팟 프로젝트 ID를 아래에 입력하세요.
// 프로젝트 URL (https://penpot.app/#/view/123a123a-1a12-1a1a-12a1-1234a123a123)에서
// 괄호 안의 긴 문자열이 프로젝트 ID입니다.
const PROJECT_ID = 'e7c79b0d-7aa0-808c-8006-d5123b41b9e5';

// 새로운 페이지를 추가하는 함수
async function createNewPage() {
  // API 엔드포인트 URL
  const API_URL = `https://penpot.app/api/v1/projects/${PROJECT_ID}/pages`;

  // API 요청 헤더
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}`,
  };

  // 새로운 페이지의 데이터 (임의의 이름)
  const pageData = {
    name: `자동 생성 페이지 ${new Date().toLocaleTimeString()}`,
  };

  try {
    console.log('펜팟 프로젝트에 새 페이지를 생성합니다...');
    const response = await axios.post(API_URL, pageData, { headers });

    if (response.status === 201) {
      console.log('✅ 새 페이지가 성공적으로 생성되었습니다!');
      console.log(`페이지 이름: ${response.data.name}`);
      console.log(`페이지 ID: ${response.data.id}`);
    } else {
      console.error(
        '⚠️ 페이지 생성 실패:',
        response.status,
        response.statusText
      );
      console.error('응답 데이터:', response.data);
    }
  } catch (error) {
    console.error('❌ API 호출 중 오류 발생:', error.message);
    if (error.response) {
      console.error('오류 응답 데이터:', error.response.data);
    }
  }
}

// 함수 실행
createNewPage();
