import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";

export default function InfluencerSearch() {
  const location = useLocation();
  const filtersFromState = location.state || {};
  const [filters, setFilters] = useState({
    platform: filtersFromState.platform || "",
    followerCount: filtersFromState.followers || "",
    region: filtersFromState.region || "",
  });

  const [results, setResults] = useState([]);
  const ownerId = localStorage.getItem("uid"); // 🔐 현재 사장님 UID 저장된 로컬 값 사용

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    let q = collection(db, "users");
    const conditions = [where("role", "==", "influencer")];

    if (filters.platform) {
      conditions.push(where("platform", "==", filters.platform));
    }
    if (filters.followerCount) {
      conditions.push(where("followerCount", ">=", parseInt(filters.followerCount)));
    }
    if (filters.region) {
      conditions.push(where("region", "==", filters.region));
    }

    const filteredQuery = query(q, ...conditions);
    const snapshot = await getDocs(filteredQuery);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setResults(data);
  };

  const handleMatch = async (influencer) => {
    if (!ownerId) {
      alert("사장님 정보가 없습니다. 다시 로그인 해주세요.");
      return;
    }

    try {
      await addDoc(collection(db, "matchedInfluencers"), {
        ownerId,
        influencerId: influencer.id,
        influencerName: influencer.influencerName,
        platform: influencer.platform,
        followerCount: influencer.followerCount,
        region: influencer.region || "",
        timestamp: new Date(),
      });
      alert("✅ 매칭 희망 인플루언서로 등록되었습니다!");
    } catch (error) {
      console.error("매칭 등록 오류:", error);
      alert("❌ 등록 실패: " + error.message);
    }
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="py-4">
      <h4>🎯 인플루언서 조건 검색</h4>
      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Select name="platform" onChange={handleChange} value={filters.platform}>
              <option value="">SNS 플랫폼</option>
              <option value="인스타그램">인스타그램</option>
              <option value="유튜브">유튜브</option>
              <option value="틱톡">틱톡</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="number"
              name="followerCount"
              placeholder="최소 팔로워 수"
              value={filters.followerCount}
              onChange={handleChange}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              name="region"
              placeholder="활동 지역"
              value={filters.region}
              onChange={handleChange}
            />
          </Col>
          <Col md={3}>
            <Button variant="primary" onClick={handleSearch}>
              🔍 검색
            </Button>
          </Col>
        </Row>
      </Form>

      <Row>
        {results.map((influencer) => (
          <Col md={4} key={influencer.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{influencer.influencerName}</Card.Title>
                <Card.Text>
                  플랫폼: {influencer.platform} <br />
                  팔로워: {influencer.followerCount}명 <br />
                  지역: {influencer.region || "미입력"} <br />
                  소개: {influencer.introduction}
                </Card.Text>
                <Button
                  variant="success"
                  onClick={() => handleMatch(influencer)}
                >
                  매칭 희망 인플루언서로 등록
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
