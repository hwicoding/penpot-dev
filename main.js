// =============================================================================
// 이 스크립트는 펜팟 API를 사용하여 단계별로 ID를 검증하는 디버깅용 코드입니다.
// =============================================================================

// 로컬에서 .env 파일을 사용하기 위한 dotenv 라이브러리를 불러옵니다.
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// HTTP 요청을 보내기 위한 axios 라이브러리를 불러옵니다.
const axios = require('axios');

// =============================================================================
// 환경 변수에서 필요한 ID들을 가져옵니다.
// .env 파일 또는 깃허브 Secrets에 저장된 값입니다.
// =============================================================================
const PENPOT_ACCESS_TOKEN = process.env.PENPOT_ACCESS_TOKEN;
const PROJECT_ID = process.env.PROJECT_ID;
const FILE_ID = process.env.FILE_ID;
const PAGE_ID = process.env.PAGE_ID;

// =============================================================================
// ID 검증 단계별 함수
// =============================================================================

// 1. PROJECT_ID가 유효한지 검증하는 함수
async function checkProjectId() {
  const API_URL = `https://design.penpot.app/api/v1/projects/${PROJECT_ID}/files`;
  const headers = { Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}` };

  try {
    console.log(`프로젝트 ID '${PROJECT_ID}' 검증 중...`);
    const response = await axios.get(API_URL, { headers });
    console.log(`✅ 프로젝트 ID 검증 성공! 상태 코드: ${response.status}`);
    console.log('이어서 파일 ID 검증을 진행하세요.');
  } catch (error) {
    console.error('❌ 프로젝트 ID가 잘못되었습니다.', error.message);
    console.error('오류 응답:', error.response.data);
    process.exit(1);
  }
}

// 2. FILE_ID가 유효한지 검증하는 함수
async function checkFileId() {
  const API_URL = `https://design.penpot.app/api/v1/files/${FILE_ID}`;
  const headers = { Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}` };

  try {
    console.log(`파일 ID '${FILE_ID}' 검증 중...`);
    const response = await axios.get(API_URL, { headers });
    console.log(`✅ 파일 ID 검증 성공! 상태 코드: ${response.status}`);
    console.log('이어서 페이지 ID 검증을 진행하세요.');
  } catch (error) {
    console.error('❌ 파일 ID가 잘못되었습니다.', error.message);
    console.error('오류 응답:', error.response.data);
    process.exit(1);
  }
}

// 3. PAGE_ID가 유효한지 검증하는 함수
async function checkPageId() {
  const API_URL = `https://design.penpot.app/api/v1/files/${FILE_ID}/pages/${PAGE_ID}/elements`;
  const headers = { Authorization: `Bearer ${PENPOT_ACCESS_TOKEN}` };
  const requestBody = {
    /* 빈 데이터로 테스트 */
  };

  try {
    console.log(`페이지 ID '${PAGE_ID}' 검증 중...`);
    // 페이지 ID 자체를 검증하는 API가 없으므로 요소 생성 API로 테스트합니다.
    await axios.post(API_URL, requestBody, { headers });
    console.log(`✅ 페이지 ID 검증 성공! 상태 코드: 201`);
    console.log('모든 ID가 올바릅니다! 이제 최종 코드를 실행하세요.');
  } catch (error) {
    console.error('❌ 페이지 ID가 잘못되었습니다.', error.message);
    console.error('오류 응답:', error.response.data);
    process.exit(1);
  }
}

// =============================================================================
// 실행할 함수를 선택하고 주석을 제거하세요.
// =============================================================================
// checkProjectId();
// checkFileId();
// checkPageId(); // 이 함수는 FILE_ID가 올바르다는 가정 하에 실행됩니다.
