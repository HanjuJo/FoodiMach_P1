import firebase_admin
from firebase_admin import credentials, firestore

# 🔑 Firebase Admin SDK 초기화 (serviceAccountKey.json 경로 확인!)
cred = credentials.Certificate("./serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# ✅ 더미 사장님 데이터 (20개)
dummy_owners = [
  {
    "uid": "owner_001",
    "role": "owner",
    "email": "owner1@example.com",
    "ownerName": "김사장",
    "shopName": "김밥천국 1호점",
    "category": "한식",
    "address": "서울특별시 강남구 역삼동 123-1",
    "description": "저렴하고 맛있는 김밥",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_002",
    "role": "owner",
    "email": "owner2@example.com",
    "ownerName": "박사장",
    "shopName": "수제버거 박스",
    "category": "양식",
    "address": "서울 마포구 서교동 45-2",
    "description": "100% 수제버거 전문점",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_003",
    "role": "owner",
    "email": "owner3@example.com",
    "ownerName": "이사장",
    "shopName": "청년곱창",
    "category": "한식",
    "address": "부산 해운대구 우동 345-6",
    "description": "매운 곱창으로 인기 폭발!",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_004",
    "role": "owner",
    "email": "owner4@example.com",
    "ownerName": "최사장",
    "shopName": "바삭한 닭강정",
    "category": "분식",
    "address": "대구 수성구 범어동 90-1",
    "description": "바삭한 튀김의 정석",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_005",
    "role": "owner",
    "email": "owner5@example.com",
    "ownerName": "정사장",
    "shopName": "아침엔죽",
    "category": "한식",
    "address": "서울 동작구 사당동 12-10",
    "description": "든든한 아침을 위한 죽 전문점",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_006",
    "role": "owner",
    "email": "owner6@example.com",
    "ownerName": "조사장",
    "shopName": "미소커피",
    "category": "카페",
    "address": "서울 강서구 마곡동 321-8",
    "description": "로스팅부터 다른 스페셜티 커피",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_007",
    "role": "owner",
    "email": "owner7@example.com",
    "ownerName": "한사장",
    "shopName": "대패삼겹 연탄불",
    "category": "한식",
    "address": "경기 성남시 분당구 수내동 10-3",
    "description": "연탄불 향 가득한 삼겹살",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_008",
    "role": "owner",
    "email": "owner8@example.com",
    "ownerName": "윤사장",
    "shopName": "밀크베이커리",
    "category": "디저트",
    "address": "서울 용산구 이태원로 210",
    "description": "매일 아침 갓 구운 빵",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_009",
    "role": "owner",
    "email": "owner9@example.com",
    "ownerName": "장사장",
    "shopName": "해장국집",
    "category": "한식",
    "address": "부산 남구 대연동 11-8",
    "description": "진한 국물로 해장 완벽!",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_010",
    "role": "owner",
    "email": "owner10@example.com",
    "ownerName": "서사장",
    "shopName": "태국쌀국수 팟타이",
    "category": "아시아음식",
    "address": "인천 연수구 송도동 123-9",
    "description": "현지 셰프가 만든 정통 쌀국수",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_011",
    "role": "owner",
    "email": "owner11@example.com",
    "ownerName": "백사장",
    "shopName": "양꼬치앤칭따오",
    "category": "중식",
    "address": "서울 중구 충무로 55",
    "description": "직화로 구운 정통 양꼬치",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_012",
    "role": "owner",
    "email": "owner12@example.com",
    "ownerName": "문사장",
    "shopName": "회덮밥이야기",
    "category": "일식",
    "address": "서울 관악구 신림동 82-3",
    "description": "신선한 해산물로 만든 덮밥",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_013",
    "role": "owner",
    "email": "owner13@example.com",
    "ownerName": "신사장",
    "shopName": "브런치카페 라루즈",
    "category": "브런치",
    "address": "서울 성동구 성수동1가 55-7",
    "description": "도심 속 여유로운 브런치 공간",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_014",
    "role": "owner",
    "email": "owner14@example.com",
    "ownerName": "강사장",
    "shopName": "감자탕과 뼈해장국",
    "category": "한식",
    "address": "서울 금천구 시흥동 99-5",
    "description": "국물이 끝내주는 감자탕",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_015",
    "role": "owner",
    "email": "owner15@example.com",
    "ownerName": "노사장",
    "shopName": "노티드 도넛",
    "category": "디저트",
    "address": "서울 서초구 반포동 88-3",
    "description": "부드러운 도넛과 달콤한 크림",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_016",
    "role": "owner",
    "email": "owner16@example.com",
    "ownerName": "배사장",
    "shopName": "배떡 로제떡볶이",
    "category": "분식",
    "address": "서울 은평구 불광동 12-8",
    "description": "로제소스 떡볶이의 진수",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_017",
    "role": "owner",
    "email": "owner17@example.com",
    "ownerName": "하사장",
    "shopName": "한우정육식당",
    "category": "한식",
    "address": "서울 노원구 상계동 23-4",
    "description": "직접 고르는 한우! 정육식당",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_018",
    "role": "owner",
    "email": "owner18@example.com",
    "ownerName": "임사장",
    "shopName": "스시도모",
    "category": "일식",
    "address": "서울 강남구 논현동 67-1",
    "description": "가성비 최고의 스시 오마카세",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_019",
    "role": "owner",
    "email": "owner19@example.com",
    "ownerName": "유사장",
    "shopName": "홍콩딤섬전문점",
    "category": "중식",
    "address": "서울 송파구 잠실동 22-3",
    "description": "홍콩 현지 느낌 그대로!",
    "createdAt": "2025-05-06T00:00:00Z"
  },
  {
    "uid": "owner_020",
    "role": "owner",
    "email": "owner20@example.com",
    "ownerName": "오사장",
    "shopName": "오떡오분식",
    "category": "분식",
    "address": "서울 구로구 구로동 101-5",
    "description": "떡볶이, 순대, 튀김 삼종세트!",
    "createdAt": "2025-05-06T00:00:00Z"
  }
]


# 🔄 Firestore에 업로드
for owner in dummy_owners:
    doc_ref = db.collection("owners").document(owner["uid"])
    doc_ref.set(owner)

print("✅ 더미 사장님 데이터 업로드 완료")
