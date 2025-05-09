import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Container, Card, Button, Row, Col, Form, Alert, Spinner
} from "react-bootstrap";

export default function InfluencerDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
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
  }, [id, navigate]);

  const handleSearch = async () => {
    setLoading(true);
    setSearchMessage("🏪 사업장을 검색 중입니다...");

    setTimeout(async () => {
      let q = collection(db, "owners");
      const conditions = [];

      if (region) conditions.push(where("address", ">=", region));
      if (category) conditions.push(where("category", "==", category));
      if (conditions.length > 0) {
        q = query(collection(db, "owners"), ...conditions);
      }

      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(result);

      setSearchMessage("✅ 검색 완료!");
      setLoading(false);
    }, 1500);
  };

  if (!data) return <div className="text-center mt-5">불러오는 중...</div>;

  return (
    <Container className="py-5">

      {/* 개별 정보 카드 */}
      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body><strong>📮 이메일:</strong> {data.email}</Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body><strong>📱 플랫폼:</strong> {data.platform}</Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body><strong>👥 팔로워:</strong> {data.followerCount}</Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body><strong>🌍 지역:</strong> {data.region || "미입력"}</Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Card className="mb-3">
            <Card.Body><strong>📝 소개:</strong> {data.introduction}</Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 조건 검색 폼 */}
      <Card className="mt-4 p-4 shadow-sm border-1 rounded-4">
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
            <Button variant="primary" onClick={handleSearch}>
              사업장 검색하기 🔍
            </Button>
            <p></p>
             {/* 로딩 및 완료 메시지 */}
      {loading && (
        <Alert variant="info" className="text-center">
          <Spinner animation="border" size="sm" className="me-2" />
          {searchMessage}
        </Alert>
      )}
      {!loading && searchMessage && (
        <Alert variant="success" className="text-center">{searchMessage}</Alert>
      )}
          </div>
        </Form>
      </Card>

      {/* 검색 결과 출력 */}
      {results.length > 0 && (
        <Card className="mt-4 p-4 shadow-sm border-0 rounded-4">
          <h5 className="mb-3 fw-bold">📋 검색된 사업장</h5>
          <Row>
            {results.map((shop) => (
              <Col md={4} key={shop.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{shop.shopName}</Card.Title>
                    <Card.Text>
                      📍 지역: {shop.address} <br />
                      🏷️ 업종: {shop.category} <br />
                      👤 사업자: {shop.ownerName} <br />
                      📝 소개: {shop.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </Container>
  );
}
