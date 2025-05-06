// src/pages/Home.js
import { useEffect, useState } from "react";
import { Container, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const uid = currentUser.uid;

        // 사장님은 owners 컬렉션, 인플루언서는 users 컬렉션
        const ownerDoc = await getDoc(doc(db, "owners", uid));
        const influencerDoc = await getDoc(doc(db, "users", uid));

        if (ownerDoc.exists()) {
          setRole("owner");
        } else if (influencerDoc.exists()) {
          setRole("influencer");
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    // 로그인 전 기본 홈 화면
    return (
      <Container className="mt-5 text-center">

     ,'' <br></br>

        <h1>푸디매치 🍽️</h1>
        <p>SNS 인플루언서와 외식업 소상공인을 연결합니다.</p>
        <Button variant="success" className="m-2" onClick={() => navigate("/business")}>
          사장님으로 시작하기
        </Button>
        <Button variant="primary" onClick={() => navigate("/influencer")}>
          인플루언서로 참여하기
        </Button>
      </Container>
    );
  }

  // 로그인 후 역할별 분기된 홈 화면
  return (
    <Container className="mt-5">
     <br></br>
      {role === "owner" && (
        <Card className="p-4 shadow-sm">
          <h3>👨‍🍳 사장님, 푸디매치에서 이렇게 활용해보세요</h3>
          <ul>
            <li>조건 기반 인플루언서 검색 및 비교</li>
            <li>나의 가게 정보 등록 및 수정</li>
            <li>입찰을 통한 마케팅 협업 매칭</li>
          </ul>
          <Button variant="warning" onClick={() => navigate(`/dashboard/${user.uid}`)}>
            대시보드 바로가기 →
          </Button>
        </Card>
      )}
      {role === "influencer" && (
        <Card className="p-4 shadow-sm">
          <h3>📸 인플루언서님, 푸디매치와 함께해요!</h3>
          <ul>
            <li>나의 정보 등록 및 수정</li>
            <li>맞춤형 사업장 검색</li>
            <li>입찰 참여를 통한 마케팅 기회 확보</li>
          </ul>
          <Button variant="primary" onClick={() => navigate(`/dashboard-influencer/${user.uid}`)}>
            대시보드 바로가기 →
          </Button>
        </Card>
      )}
    </Container>
  );
}
