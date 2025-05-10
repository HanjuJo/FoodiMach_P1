
import { useEffect, useState } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AOS from "aos";
import "aos/dist/aos.css";

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

    AOS.init({ duration: 800 });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <div className="hero-section mb-5" data-aos="fade-down">
          <h1 className="display-4 fw-bold text-dark">푸디매치 🍽️</h1>
          <p className="lead mt-3 text-secondary">
            외식업 사장님과 SNS 인플루언서를 <strong>입찰 방식</strong>으로 연결하는 마케팅 플랫폼
          </p>
          <p className="text-muted">
            사장님은 마케팅 파트너를 쉽게 찾고, 인플루언서는 협업 기회를 넓혀보세요!
          </p>
          <div className="d-grid gap-3 mt-4" style={{ maxWidth: "320px", margin: "0 auto" }}>
            <Button variant="success" size="lg" onClick={() => navigate("/business")}>
              👨‍🍳 사장님으로 시작하기
            </Button>
            <Button variant="primary" size="lg" onClick={() => navigate("/influencer")}>
              📸 인플루언서로 참여하기
            </Button>
          </div>
        </div>

        <Row className="g-4 mb-5">
          <Col md={6}>
            <Card className="p-4 shadow-sm text-start h-100" data-aos="fade-up">
              <h5 className="text-success fw-bold mb-3">🧑‍🍳 사장님을 위한 혜택</h5>
              <ul className="mb-0 small">
                <li>🔍 맞춤 인플루언서 검색 (지역/업종 기반)</li>
                <li>💰 입찰 방식으로 마케팅 예산 절감</li>
                <li>📊 대시보드에서 제안 관리 간편</li>
              </ul>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-4 shadow-sm text-start h-100" data-aos="fade-up">
              <h5 className="text-primary fw-bold mb-3">📸 인플루언서를 위한 혜택</h5>
              <ul className="mb-0 small">
                <li>🏪 조건에 맞는 사업장 탐색</li>
                <li>💌 입찰 참여로 다양한 협업 기회</li>
                <li>✅ 제안 수락 여부 실시간 확인</li>
              </ul>
            </Card>
          </Col>
        </Row>

        <footer className="mt-5 pt-4 pb-3 bg-light text-center text-muted small">
          <div>© 2025 푸디매치 (FoodiMatch) All rights reserved.</div>
          <div>
            <a href="/privacy" className="text-muted me-3">개인정보 처리방침</a>
            <a href="/terms" className="text-muted">이용약관</a>
          </div>
        </footer>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      {role === "owner" && (
        <Card className="p-4 shadow-sm bg-light mb-4" data-aos="fade-up">
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
        <Card className="p-4 shadow-sm bg-light mb-4" data-aos="fade-up">
          <h3 className="mb-3">📸 인플루언서님, 푸디매치에서 기회를 찾으세요!</h3>
          <ul>
            <li>맞춤 사업장 검색으로 원하는 조건 찾기</li>
            <li>내 정보 등록 및 다양한 입찰 제안 가능</li>
            <li>수락된 제안은 전화번호 포함 공개됨</li>
          </ul>
          <div className="text-end">
            <Button variant="primary" onClick={() => navigate(`/dashboard-influencer/${user.uid}`)}>
              대시보드 바로가기 →
            </Button>
          </div>
        </Card>
      )}

      <footer className="mt-5 pt-4 pb-3 bg-light text-center text-muted small">
        <div>© 2025 푸디매치 (FoodiMatch) All rights reserved.</div>
        <div>
          <a href="/privacy" className="text-muted me-3">개인정보 처리방침</a>
          <a href="/terms" className="text-muted">이용약관</a>
        </div>
      </footer>
    </Container>
  );
}
