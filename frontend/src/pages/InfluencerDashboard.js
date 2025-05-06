import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";

export default function InfluencerDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    const fetchData = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        alert("사용자 정보를 찾을 수 없습니다.");
        navigate("/");
      }
    };

    fetchData();

    return () => unsubscribe();
  }, [id, navigate]);

  const handleSearchBusinesses = () => {
    navigate("/business-search", {
      state: { region, category },
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!data) return <div className="text-center mt-5">불러오는 중...</div>;

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0 rounded-4 p-4" style={{ background: "#fffdf7" }}>
        <div className="d-flex justify-content-between">
          <h3 className="mb-4 text-primary">{data.influencerName} 님의 대시보드</h3>

        </div>
        <Row className="mb-3">
          <Col><strong>📮 이메일:</strong> {data.email}</Col>
          <Col><strong>📱 플랫폼:</strong> {data.platform}</Col>
        </Row>
        <Row className="mb-3">
          <Col><strong>👥 팔로워:</strong> {data.followerCount}</Col>
          <Col><strong>🌍 지역:</strong> {data.region || "미입력"}</Col>
        </Row>
        <Row className="mb-3">
          <Col><strong>📝 소개:</strong> {data.introduction}</Col>
        </Row>
      </Card>

      <Card className="mt-4 p-4 shadow-sm border-0 rounded-4" style={{ background: "#f1faff" }}>
        <h5 className="mb-3">🏪 사업장 조건 설정</h5>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>지역</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="예: 인천, 서울 등"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>업종</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="예: 고깃집, 카페 등"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end">
            <Button variant="primary" onClick={handleSearchBusinesses}>
              사업장 검색하기 🔎
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
