
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";

export default function BusinessSearch({ influencerId }) {
  const [filters, setFilters] = useState({ region: "", category: "" });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearchMessage("사업장 정보를 검색중입니다...");
    setTimeout(async () => {
      let q = query(collection(db, "owners"));
      const conditions = [];
      if (filters.region) conditions.push(where("address", ">=", filters.region));
      if (filters.category) conditions.push(where("category", "==", filters.category));
      if (conditions.length > 0) {
        q = query(collection(db, "owners"), ...conditions);
      }
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(data);
      setSearchMessage("검색 완료!");
      setLoading(false);
    }, 1000);
  };

  return (
    <Container className="mt-4">
      <h5>🔍 사업장 조건 검색</h5>
      <Form className="mb-3">
        <Row>
          <Col md={5}>
            <Form.Control name="region" placeholder="지역" onChange={handleChange} />
          </Col>
          <Col md={5}>
            <Form.Control name="category" placeholder="업종" onChange={handleChange} />
          </Col>
          <Col md={2}>
            <Button onClick={handleSearch}>검색</Button>
          </Col>
        </Row>
      </Form>
      {loading && <Alert variant="info"><Spinner animation="border" size="sm" /> {searchMessage}</Alert>}
      {!loading && searchMessage && <Alert variant="success">{searchMessage}</Alert>}
      <Row>
        {results.map((shop) => (
          <Col md={4} key={shop.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{shop.shopName}</Card.Title>
                <Card.Text>
                  주소: {shop.address}<br />
                  업종: {shop.category}<br />
                  소개: {shop.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
