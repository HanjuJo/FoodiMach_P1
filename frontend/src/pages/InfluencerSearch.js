import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";

export default function InfluencerSearch() {
  const location = useLocation();
  const initFilters = location.state || {};

  const [filters, setFilters] = useState({
    platform: initFilters.platform || "",
    followerCount: initFilters.followers || "",
    region: initFilters.region || "",
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    let q = collection(db, "users");
    let conditions = [where("role", "==", "influencer")];

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

  // 🔥 최초 진입 시 전달된 조건이 있으면 자동 검색
  useEffect(() => {
    if (initFilters.platform || initFilters.followers || initFilters.region) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="py-4">
    <br></br>
      <h4>🎯 인플루언서 조건 검색</h4>
      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Select name="platform" value={filters.platform} onChange={handleChange}>
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
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
