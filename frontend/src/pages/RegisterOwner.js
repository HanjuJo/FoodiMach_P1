import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; // ✅ 변경된 부분
import { auth, db } from "../firebaseConfig";

export default function RegisterOwner() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    ownerName: "",
    shopName: "",
    category: "",
    address: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      // ✅ Firestore의 owners 컬렉션에 uid를 문서 ID로 사용
      await setDoc(doc(db, "owners", user.uid), {
        uid: user.uid,
        role: "owner",
        email: form.email,
        ownerName: form.ownerName,
        shopName: form.shopName,
        category: form.category,
        address: form.address,
        description: form.description,
        createdAt: new Date(),
      });

      alert("🎉 회원가입 완료! 대시보드로 이동합니다");
      navigate(`/dashboard/${user.uid}`);
    } catch (error) {
      console.error("가입 오류:", error);
      alert("❌ 가입 실패: " + error.message);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">🍜 사장님 회원가입</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

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
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Form.Label>주소</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>소개</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="warning" type="submit" className="w-100">
          시작하기 🚀
        </Button>
      </Form>
    </Container>
  );
}
