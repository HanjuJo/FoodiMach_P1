// src/pages/DashboardOwner.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc, getDoc, collection, query, where, getDocs, addDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Container, Card, Button, Row, Col, Form, Alert, Spinner
} from "react-bootstrap";

export default function DashboardOwner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [platform, setPlatform] = useState("");
  const [region, setRegion] = useState("");
  const [followers, setFollowers] = useState("");
  const [influencers, setInfluencers] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

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

    async function fetchRegisteredInfluencers() {
      const q = query(collection(db, "interestedInfluencers"), where("ownerId", "==", id));
      const snapshot = await getDocs(q);
      const ids = snapshot.docs.map(doc => doc.data().influencerId);
      setRegisteredIds(ids);
    }

    fetchData();
    fetchRegisteredInfluencers();
  }, [id, navigate]);

  const handleEdit = () => navigate(`/edit-owner/${id}`);

  const handleSearchInfluencers = async () => {
    setLoading(true);
    setSearchMessage("사업주님과 협업을 진행할 인플루언서를 검색 중입니다...");

    setTimeout(async () => {
      let q = query(collection(db, "users"), where("role", "==", "influencer"));
      const conditions = [];
      if (platform) conditions.push(where("platform", "==", platform));
      if (region) conditions.push(where("region", "==", region));
      if (followers) conditions.push(where("followerCount", ">=", parseInt(followers)));
      if (conditions.length > 0) {
        q = query(collection(db, "users"), where("role", "==", "influencer"), ...conditions);
      }

      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInfluencers(result);

      setSearchMessage("✅ 검색 완료!");
      setLoading(false);
    }, 1500);
  };

  const handleRegisterInterest = async (influencer) => {
    try {
      await addDoc(collection(db, "interestedInfluencers"), {
        ownerId: id,
        influencerId: influencer.id,
        influencerName: influencer.influencerName,
        platform: influencer.platform,
        region: influencer.region,
        followerCount: influencer.followerCount,
        createdAt: new Date()
      });
      alert(`'${influencer.influencerName}' 님을 매칭 희망 인플루언서로 등록했습니다.`);
      setRegisteredIds([...registeredIds, influencer.id]);
    } catch (err) {
      alert("등록 실패: " + err.message);
    }
  };

  if (!data) return <div className="text-center mt-5">불러오는 중...</div>;

  return (
    <Container className="py-5">

      <h3 className="mb-4 text-warning">{data.shopName} 대시보드</h3>
      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <Card.Title>📛 사업자명</Card.Title>
            <Card.Text>{data.ownerName}</Card.Text>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <Card.Title>🏷️ 업종</Card.Title>
            <Card.Text>{data.category}</Card.Text>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <Card.Title>📍 주소</Card.Title>
            <Card.Text>{data.address}</Card.Text>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <Card.Title>📝 소개</Card.Title>
            <Card.Text>{data.description}</Card.Text>
          </Card>
        </Col>
      </Row>
      <div className="mt-4 text-end">
        <Button variant="outline-warning" className="me-2" onClick={handleEdit}>✏️ 수정</Button>
        {/* 삭제는 관리자만 가능하므로 버튼은 제거 */}
      </div>

      {/* 조건 검색 영역 */}
      <Card className="mt-5 p-4 shadow-sm border-0 rounded-4" style={{ background: "#f1faff" }}>
        <h5 className="mb-4 fw-bold">🤝 인플루언서 조건 검색</h5>
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
                <Form.Label>📍 지역</Form.Label>
                <Form.Control
                  type="text"
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
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end mt-3">
            <Button variant="primary" onClick={handleSearchInfluencers}>
              인플루언서 검색 🔍
            </Button>

            <p></p>
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

      {/* 결과 출력 */}
      {influencers.length > 0 && (
        <Card className="mt-4 p-4 shadow-sm border-0 rounded-4">
          <h5 className="mb-3 fw-bold">🎯 매칭 희망 인플루언서 등록</h5>
          <Row>
            {influencers.map((inf) => (
              <Col md={4} key={inf.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{inf.influencerName}</Card.Title>
                    <Card.Text>
                      플랫폼: {inf.platform} <br />
                      팔로워: {inf.followerCount}명 <br />
                      지역: {inf.region || "미입력"} <br />
                      소개: {inf.introduction}
                    </Card.Text>
                    {registeredIds.includes(inf.id) ? (
                      <Button variant="success" disabled>등록완료 ✅</Button>
                    ) : (
                      <Button variant="outline-success" onClick={() => handleRegisterInterest(inf)}>
                        매칭 희망 등록 ✅
                      </Button>
                    )}
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
