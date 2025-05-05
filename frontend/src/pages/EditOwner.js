import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditOwner() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    ownerName: "",
    shopName: "",
    category: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "owners", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setForm(docSnap.data());
      } else {
        alert("해당 사업자를 찾을 수 없습니다.");
        navigate("/owner-list");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, "owners", id);
      await updateDoc(docRef, form);
      alert("✅ 수정이 완료되었습니다!");
      navigate("/owner-list");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("❌ 수정 실패. 다시 시도해주세요.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">✏️ 사업자 정보 수정</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="ownerName">
          <Form.Label>사업자명</Form.Label>
          <Form.Control
            type="text"
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="shopName">
          <Form.Label>가게명</Form.Label>
          <Form.Control
            type="text"
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="category">
          <Form.Label>업종</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>주소</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>소개</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          저장
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate("/owner-list")}>목록으로</Button>
      </Form>
    </Container>
  );
}