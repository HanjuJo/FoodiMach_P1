import firebase_admin
from firebase_admin import credentials, firestore

# Firebase Admin SDK 초기화
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 더미 인플루언서 데이터
dummy_influencers = [
  {
    "uid": "dummy001",
    "role": "influencer",
    "influencerName": "맛집탐방러 준식",
    "platform": "인스타그램",
    "followerCount": 8500,
    "region": "서울",
    "introduction": "서울 맛집을 소개하는 준식입니다!"
  },
  {
    "uid": "dummy002",
    "role": "influencer",
    "influencerName": "하윤맘",
    "platform": "유튜브",
    "followerCount": 12000,
    "region": "인천",
    "introduction": "아이와 함께 즐기는 외식 콘텐츠를 제작합니다."
  },
  {
    "uid": "dummy003",
    "role": "influencer",
    "influencerName": "비건이의 먹방로그",
    "platform": "틱톡",
    "followerCount": 30000,
    "region": "경기",
    "introduction": "비건식 맛집 위주로 틱톡 영상 업로드 중!"
  },
  {
    "uid": "dummy004",
    "role": "influencer",
    "influencerName": "소식좌 은지",
    "platform": "인스타그램",
    "followerCount": 9500,
    "region": "부산",
    "introduction": "분위기 좋은 카페 & 브런치 위주 콘텐츠"
  },
  {
    "uid": "dummy005",
    "role": "influencer",
    "influencerName": "대식가 태현",
    "platform": "유튜브",
    "followerCount": 43000,
    "region": "서울",
    "introduction": "대식 콘텐츠 유튜버! 고깃집 리뷰 다수"
  },
  {
    "uid": "dummy006",
    "role": "influencer",
    "influencerName": "소확행 민정",
    "platform": "틱톡",
    "followerCount": 7000,
    "region": "인천",
    "introduction": "인천 중심의 짧고 강한 맛집 소개"
  },
  {
    "uid": "dummy007",
    "role": "influencer",
    "influencerName": "혼밥왕 유리",
    "platform": "인스타그램",
    "followerCount": 15000,
    "region": "대전",
    "introduction": "혼밥, 혼술 맛집 위주 콘텐츠 운영"
  },
  {
    "uid": "dummy008",
    "role": "influencer",
    "influencerName": "청년미식가",
    "platform": "유튜브",
    "followerCount": 19000,
    "region": "광주",
    "introduction": "전라도 중심의 가성비 맛집 추천!"
  },
  {
    "uid": "dummy009",
    "role": "influencer",
    "influencerName": "맛로그 in 강릉",
    "platform": "인스타그램",
    "followerCount": 5600,
    "region": "강원",
    "introduction": "강릉의 숨은 맛집 탐방"
  },
  {
    "uid": "dummy010",
    "role": "influencer",
    "influencerName": "부산노마드",
    "platform": "틱톡",
    "followerCount": 22000,
    "region": "부산",
    "introduction": "부산 먹거리와 해산물 중심 콘텐츠"
  }
]


# Firestore 업로드
for influencer in dummy_influencers:
    db.collection("users").add(influencer)

print("✅ 더미 인플루언서 10건 등록 완료!")
