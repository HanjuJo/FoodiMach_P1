import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { onAuthStateChanged } from "firebase/auth";

export default function BusinessSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialRegion = location.state?.region || "";
  const initialCategory = location.state?.category || "";

  const [filters, setFilters] = useState({
    region: initialRegion,
    category: initialCategory,
  });

  const [results, setResults] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });

    const handleSearch = async () => {
      let q = collection(db, "owners");
      const conditions = [];

      if (filters.region) {
        conditions.push(where("address", ">=", filters.region));
      }
      if (filters.category) {
        conditions.push(where("category", "==", filters.category));
      }

      const filteredQuery = conditions.length > 0 ? query(q, ...conditions) : q;
      const snapshot = await getDocs(filteredQuery);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(data);
    };

    handleSearch();
    return () => unsubscribe();
  }, [filters, navigate]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    let q = collection(db, "owners");
    const conditions = [];

    if (filters.region) {
      conditions.push(where("address", ">=", filters.region));
    }
    if (filters.category) {
      conditions.push(where("category", "==", filters.category));
    }

    const filteredQuery = conditions.length > 0 ? query(q, ...conditions) : q;
    const snapshot = await getDocs(filteredQuery);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setResults(data);
  };

  return (
    <Container className="py-4">
    <p className="mt-5"></p>
      <h4>🏪 사업장 조건 검색</h4>
      <Form className="mb-4">
        <Row>
          <Col md={5}>
            <Form.Control
              name="region"
              placeholder="지역 (예: 인천)"
              value={filters.region}
              onChange={handleChange}
            />
          </Col>
          <Col md={5}>
            <Form.Control
              name="category"
              placeholder="업종 (예: 고깃집)"
              value={filters.category}
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <Button variant="primary" onClick={handleSearch}>
              🔍 검색
            </Button>
          </Col>
        </Row>
      </Form>

      <Row>
        {results.length === 0 && <p>검색 결과가 없습니다.</p>}
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
    </Container>
  );
}
