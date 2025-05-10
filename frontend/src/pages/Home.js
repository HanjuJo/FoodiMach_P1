import { useEffect, useState } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
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
    return (
      <Container className="mt-5 pt-5 text-center">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">푸디매치 🍽️</h1>
          <p className="lead">
            외식업 사장님과 SNS 인플루언서를 <strong>입찰 방식</strong>으로 연결하는 마케팅 플랫폼
          </p>
          <p className="text-muted">
            사장님은 마케팅 파트너를 쉽게 찾고, 인플루언서는 협업 기회를 넓혀보세요!
          </p>
          <div className="mt-4">
            <Button
              variant="success"
              className="me-3"
              size="lg"
              onClick={() => navigate("/business")}
            >
              👨‍🍳 사장님으로 시작하기
            </Button>
            <Button variant="primary" size="lg" onClick={() => navigate("/influencer")}>
              📸 인플루언서로 참여하기
            </Button>
          </div>
        </div>

        <Row className="mt-5">
          <Col md={6}>
            <Card className="p-4 shadow-sm h-100">
              <h4 className="text-success">사장님을 위한 혜택</h4>
              <ul>
                <li>내 지역/업종에 딱 맞는 인플루언서 검색</li>
                <li>맞춤형 입찰 제안으로 마케팅 예산 절감</li>
                <li>대시보드에서 쉽고 직관적인 제안 관리</li>
              </ul>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-4 shadow-sm h-100">
              <h4 className="text-primary">인플루언서를 위한 혜택</h4>
              <ul>
                <li>원하는 지역과 업종의 사업장 탐색</li>
                <li>입찰 제안을 통해 다양한 협업 가능</li>
                <li>신뢰 기반으로 제안 수락 여부 확인</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {role === "owner" && (
        <Card className="p-4 shadow-sm bg-light">
          <h3 className="mb-3">👨‍🍳 사장님, 푸디매치를 이렇게 활용해보세요!</h3>
          <ul>
            <li>조건 기반 인플루언서 검색 및 매칭</li>
            <li>내 가게 정보 등록 및 수정</li>
            <li>입찰을 통한 마케팅 협업 진행</li>
            <li>수락된 제안은 전화번호 공개로 바로 연결</li>
          </ul>
          <div className="text-end">
            <Button variant="warning" onClick={() => navigate(`/dashboard/${user.uid}`)}>
              대시보드 바로가기 →
            </Button>
          </div>
        </Card>
      )}
      {role === "influencer" && (
        <Card className="p-4 shadow-sm bg-light">
          <h3 className="mb-3">📸 인플루언서님, 푸디매치에서 기회를 찾으세요!</h3>
          <ul>
            <li>맞춤 사업장 검색으로 원하는 조건 찾기</li>
            <li>내 정보 등록 및 다양한 입찰 제안 가능</li>
            <li>수락된 제안은 전화번호 포함 공개됨</li>
          </ul>
          <div className="text-end">
            <Button
              variant="primary"
              onClick={() => navigate(`/dashboard-influencer/${user.uid}`)}
            >
              대시보드 바로가기 →
            </Button>
          </div>
        </Card>
      )}
    </Container>
  );
}
