// src/pages/InfluencerSearch.js
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";

export default function InfluencerSearch() {
  const location = useLocation();
  const initialState = location.state || {};
  const [filters, setFilters] = useState({
    platform: initialState.platform || "",
    followerCount: initialState.followers || "",
    region: initialState.region || "",
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

  useEffect(() => {
    if (filters.platform || filters.followerCount || filters.region) {
      handleSearch();
    }
  }, []);

  return (
    <Container className="py-5">
      <h4 className="mb-4">🔍 인플루언서 조건 검색</h4>
      <Card className="p-4 mb-4 shadow-sm rounded-4">
        <Form>
          <Row className="align-items-end">
            <Col md={3}>
              <Form.Group>
                <Form.Label>SNS 플랫폼</Form.Label>
                <Form.Select name="platform" value={filters.platform} onChange={handleChange}>
                  <option value="">전체</option>
                  <option value="인스타그램">인스타그램</option>
                  <option value="유튜브">유튜브</option>
                  <option value="틱톡">틱톡</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>최소 팔로워 수</Form.Label>
                <Form.Control
                  type="number"
                  name="followerCount"
                  placeholder="예: 5000"
                  value={filters.followerCount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>활동 지역</Form.Label>
                <Form.Control
                  name="region"
                  placeholder="예: 서울, 인천 등"
                  value={filters.region}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={3} className="text-end">
              <Button variant="primary" onClick={handleSearch}>
                🔍 검색
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Row>
        {results.length === 0 ? (
          <Col>
            <p className="text-muted">조건에 맞는 인플루언서가 없습니다.</p>
          </Col>
        ) : (
          results.map((influencer) => (
            <Col md={4} key={influencer.id} className="mb-3">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>{influencer.influencerName}</Card.Title>
                  <Card.Text>
                    📱 플랫폼: {influencer.platform} <br />
                    👥 팔로워 수: {influencer.followerCount} <br />
                    🌍 지역: {influencer.region || "미입력"} <br />
                    📝 소개: {influencer.introduction || "소개 없음"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
