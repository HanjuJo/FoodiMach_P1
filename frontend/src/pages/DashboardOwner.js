import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import { onAuthStateChanged } from "firebase/auth";

export default function DashboardOwner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const [platform, setPlatform] = useState("");
  const [region, setRegion] = useState("");
  const [followers, setFollowers] = useState("");

  // 🔐 로그인 상태 확인
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        alert("로그인이 필요합니다.");
        navigate("/login", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 사용자 데이터 가져오기
  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "owners", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        alert("사용자 정보를 찾을 수 없습니다.");
        navigate("/");
      }
    }
    fetchData();
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/edit-owner/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "owners", id));
      alert("삭제되었습니다.");
      navigate("/");
    }
  };

  const handleSearchInfluencers = () => {
    navigate("/influencer-search", {
      state: { platform, region, followers },
    });
  };

  if (!data) return <div className="text-center mt-5">불러오는 중...</div>;

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0 rounded-4 p-4" style={{ background: "#fffdf7" }}>
        <h3 className="mb-4 text-warning">{data.shopName} 대시보드</h3>
        <Row className="mb-3">
          <Col><strong>📛 사업자명:</strong> {data.ownerName}</Col>
          <Col><strong>🏷️ 업종:</strong> {data.category}</Col>
        </Row>
        <Row className="mb-3">
          <Col><strong>📍 주소:</strong> {data.address}</Col>
        </Row>
        <Row className="mb-3">
          <Col><strong>📝 소개:</strong> {data.description}</Col>
        </Row>

        <div className="mt-4 text-end">
          <Button variant="outline-warning" className="me-2" onClick={handleEdit}>✏️ 수정</Button>
          <Button variant="danger" onClick={handleDelete}>🗑 삭제</Button>
        </div>
      </Card>

      {/* 인플루언서 검색 영역 */}
      <Card className="mt-4 p-4 shadow-sm border-0 rounded-4" style={{ background: "#f1faff" }}>
        <h5 className="mb-4 fw-bold">🤝 인플루언서 조건 설정</h5>
        <Form>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>📱 플랫폼</Form.Label>
                <Form.Select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="">선택하세요</option>
                  <option value="인스타그램">인스타그램</option>
                  <option value="유튜브">유튜브</option>
                  <option value="틱톡">틱톡</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>📍 활동 지역</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="예: 인천, 서울 등"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>👥 팔로워 수</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="예: 1000"
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end mt-3">
            <Button variant="primary" onClick={handleSearchInfluencers}>
              인플루언서 검색하기 🔍
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
