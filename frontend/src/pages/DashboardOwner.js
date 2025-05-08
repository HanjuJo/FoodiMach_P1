// src/pages/DashboardOwner.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Form,
  Badge,
} from "react-bootstrap";

export default function DashboardOwner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ownerData, setOwnerData] = useState(null);
  const [influencers, setInfluencers] = useState([]);
  const [platform, setPlatform] = useState("");
  const [region, setRegion] = useState("");
  const [followers, setFollowers] = useState("");

  useEffect(() => {
    const fetchOwner = async () => {
      const docRef = doc(db, "owners", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOwnerData(docSnap.data());
      } else {
        alert("사용자 정보를 찾을 수 없습니다.");
        navigate("/");
      }
    };
    fetchOwner();
  }, [id, navigate]);

  const handleEdit = () => navigate(`/edit-owner/${id}`);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteDoc(doc(db, "owners", id));
      alert("삭제되었습니다.");
      navigate("/");
    }
  };

  const handleSearchInfluencers = async () => {
    let baseQuery = query(collection(db, "users"), where("role", "==", "influencer"));
    let conditions = [];

    if (platform) conditions.push(where("platform", "==", platform));
    if (region) conditions.push(where("region", "==", region));
    if (followers) conditions.push(where("followerCount", ">=", parseInt(followers)));

    const finalQuery = conditions.length ? query(baseQuery, ...conditions) : baseQuery;
    const snapshot = await getDocs(finalQuery);
    const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setInfluencers(result);
  };

  const handleBid = async (influencerId) => {
    try {
      await addDoc(collection(db, "bids"), {
        ownerId: id,
        influencerId,
        createdAt: new Date(),
      });
      alert("입찰 제안 완료!");
    } catch (err) {
      console.error("입찰 제안 오류:", err);
      alert("입찰 제안 실패");
    }
  };

  if (!ownerData) return <div className="text-center mt-5">불러오는 중...</div>;

  return (
    <Container className="py-5">
      {/* 사업자 정보 카드 */}
      <Card className="shadow-lg border-0 rounded-4 p-4" style={{ background: "#fffdf7" }}>
        <h3 className="mb-4 text-warning">{ownerData.shopName} 대시보드</h3>
        <Row className="mb-3">
          <Col><strong>📛 사업자명:</strong> {ownerData.ownerName}</Col>
          <Col><strong>🏷️ 업종:</strong> {ownerData.category}</Col>
        </Row>
        <Row className="mb-3">
          <Col><strong>📍 주소:</strong> {ownerData.address}</Col>
        </Row>
        <Row className="mb-3">
          <Col><strong>📝 소개:</strong> {ownerData.description}</Col>
        </Row>
        <div className="mt-4 text-end">
          <Button variant="outline-warning" className="me-2" onClick={handleEdit}>✏️ 수정</Button>
          <Button variant="danger" onClick={handleDelete}>🗑 삭제</Button>
        </div>
      </Card>

      {/* 검색 폼 */}
      <Card className="mt-4 p-4 shadow-sm border-0 rounded-4" style={{ background: "#f1faff" }}>
        <h5 className="mb-3 fw-bold">🔍 인플루언서 조건 설정</h5>
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
                  value={region}
                  placeholder="예: 인천"
                  onChange={(e) => setRegion(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>👥 팔로워 수</Form.Label>
                <Form.Control
                  type="number"
                  value={followers}
                  placeholder="예: 1000"
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

      {/* 인플루언서 리스트 */}
      <Row className="mt-4">
        {influencers.map((influencer) => (
          <Col md={4} key={influencer.id} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="fw-bold">{influencer.influencerName}</Card.Title>
                <Card.Text>
                  <Badge bg="info" className="me-1">{influencer.platform}</Badge>
                  <Badge bg="secondary">{influencer.region || "지역 없음"}</Badge>
                </Card.Text>
                <Card.Text>👥 {influencer.followerCount}명 팔로워</Card.Text>
                <Card.Text>📝 {influencer.introduction || "소개 없음"}</Card.Text>
                <Button variant="outline-success" onClick={() => handleBid(influencer.id)}>
                  입찰 제안 💌
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
