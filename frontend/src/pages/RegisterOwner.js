import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function RegisterOwnerWithAuth() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    ownerName: "",
    shopName: "",
    category: "",
    address: "",
    description: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "owners", user.uid), {
        ownerName: form.ownerName,
        shopName: form.shopName,
        category: form.category,
        address: form.address,
        description: form.description,
        phone: form.phone,
        email: form.email,
        createdAt: new Date(),
      });

      alert("✅ 회원가입이 완료되었습니다!");
      navigate(`/dashboard/${user.uid}`);
    } catch (err) {
      console.error(err);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">🧾 사장님 회원가입</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>사업자명</Form.Label>
          <Form.Control
            type="text"
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>가게명</Form.Label>
          <Form.Control
            type="text"
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>업종</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>주소</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>소개</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>전화번호</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            placeholder="예: 010-1234-5678"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          회원가입 완료
        </Button>
      </Form>
    </Container>
  );
}
