import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import BidProposalModal from "./BidProposalModal";

export default function InfluencerDashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(true);
  const [bidsError, setBidsError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    };

    const fetchBids = async () => {
      try {
        const q = query(collection(db, "bids"), where("influencerId", "==", id));
        const snapshot = await getDocs(q);
        const result = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBids(result);
      } catch (err) {
        console.error(err);
        setBidsError("입찰 제안 목록을 불러오는 데 실패했습니다.");
      } finally {
        setBidsLoading(false);
      }
    };

    fetchData();
    fetchBids();
  }, [id]);

  const handleSearch = async () => {
    setLoading(true);
    setSearchMessage("사업장을 검색 중입니다...");

    setTimeout(async () => {
      let q = query(collection(db, "owners"));
      const conditions = [];
      if (region) conditions.push(where("address", ">=", region));
      if (category) conditions.push(where("category", "==", category));
      if (conditions.length > 0)
        q = query(collection(db, "owners"), ...conditions);

      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBusinesses(result);

      setSearchMessage("✅ 검색 완료!");
      setLoading(false);
    }, 1500);
  };

  const openBidModal = (shop) => {
    setSelectedBusiness(shop);
    setShowModal(true);
  };

  const handleSubmitBid = async (form) => {
    if (!selectedBusiness) return;

    await addDoc(collection(db, "bids"), {
      influencerId: id,
      businessId: selectedBusiness.id,
      businessName: selectedBusiness.shopName,
      message: form.message,
      budget: form.budget,
      period: form.duration,
      concept: form.concept,
      phone: form.phone,
      sns: form.sns,
      status: "대기 중",
      phoneVisible: false,
      createdAt: new Date(),
    });

    alert("입찰 제안이 전송되었습니다.");
    setShowModal(false);
  };

  if (!data) return <div className="text-center mt-5">불러오는 중...</div>;

  return (
    <Container className="py-5">
      <Card
        className="shadow-lg border-0 rounded-4 p-4 mb-4"
        style={{ background: "#e8f5fe" }}
      >
        <h3 className="mb-4 text-primary">
          {data.influencerName} 님의 대시보드
        </h3>
        <Row className="mb-3">
          <Col>
            <strong>📮 이메일:</strong> {data.email}
          </Col>
          <Col>
            <strong>📱 플랫폼:</strong> {data.platform}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <strong>👥 팔로워:</strong> {data.followerCount}
          </Col>
          <Col>
            <strong>🌍 지역:</strong> {data.region || "미입력"}
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <strong>📝 소개:</strong> {data.introduction}
          </Col>
        </Row>
      </Card>

      {/* 사업장 검색 */}
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h5 className="mb-3">🏪 사업장 조건 검색</h5>
        <Form>
          <Row className="align-items-end">
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
              사업장 검색하기 🔎
            </Button>
          </div>
        </Form>
      </Card>

      {loading && (
        <Alert variant="info" className="mt-3 text-center">
          <Spinner animation="border" size="sm" className="me-2" />
          {searchMessage}
        </Alert>
      )}
      {!loading && searchMessage && (
        <Alert variant="success" className="mt-3 text-center">
          {searchMessage}
        </Alert>
      )}

      {businesses.length > 0 && (
        <Card className="mt-4 p-4 shadow-sm border-0 rounded-4">
          <h5 className="mb-3 fw-bold">🔍 검색된 사업장</h5>
          <Row>
            {businesses.map((shop) => (
              <Col md={4} key={shop.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Title>{shop.shopName}</Card.Title>
                    <Card.Text>
                      📍 주소: {shop.address} <br />
                      🏷️ 업종: {shop.category} <br />
                      👤 사업자: {shop.ownerName} <br />
                      📝 소개: {shop.description}
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      onClick={() => openBidModal(shop)}
                    >
                      입찰 제안 💌
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* 내가 보낸 입찰 리스트 */}
      <Card className="mt-5 p-4 shadow-sm border-0 rounded-4 bg-light">
        <h5 className="mb-3 fw-bold">📋 보낸 입찰 제안 현황</h5>
        {bidsLoading ? (
          <Spinner animation="border" />
        ) : bidsError ? (
          <Alert variant="danger">{bidsError}</Alert>
        ) : bids.length === 0 ? (
          <Alert variant="info">보낸 입찰 제안이 없습니다.</Alert>
        ) : (
          <Row>
            {bids.map((bid) => (
              <Col md={6} key={bid.id} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>{bid.businessName || "사업장"}</Card.Title>
                    <Card.Text>
                      <strong>제안 메시지:</strong> {bid.message}<br />
                      <strong>예산:</strong> ₩{bid.budget}<br />
                      <strong>기간:</strong> {bid.period}일<br />
                      <strong>컨셉:</strong> {bid.concept}<br />
                      <strong>상태:</strong>{" "}
                      <span
                        style={{
                          color:
                            bid.status === "수락됨"
                              ? "green"
                              : bid.status === "거절됨"
                              ? "red"
                              : "gray",
                          fontWeight: "bold",
                        }}
                      >
                        {bid.status || "대기 중"}
                      </span><br />
                      {bid.status === "수락됨" && bid.phoneVisible && (
                        <>
                          <strong>📞 연락처:</strong> {bid.phone}<br />
                        </>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      <BidProposalModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitBid}
      />
    </Container>
  );
}
