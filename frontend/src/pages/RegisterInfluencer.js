// src/pages/RegisterInfluencer.js
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function RegisterInfluencer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    influencerName: "",
    platform: "",
    followerCount: "",
    introduction: "",
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

      await setDoc(doc(db, "users", user.uid), {
  uid: user.uid,
  role: "influencer",
  ...form
});

      alert("🎉 인플루언서 가입 완료! 로그인해주세요.");
      navigate("/login");
    } catch (error) {
      console.error("가입 오류:", error);
      alert("❌ 가입 실패: " + error.message);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">🎥 인플루언서 회원가입</h3>
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
          <Form.Label>이름 또는 채널명</Form.Label>
          <Form.Control
            type="text"
            name="influencerName"
            value={form.influencerName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>SNS 플랫폼 (예: 인스타그램)</Form.Label>
          <Form.Control
            type="text"
            name="platform"
            value={form.platform}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>팔로워 수</Form.Label>
          <Form.Control
            type="text"
            name="followerCount"
            value={form.followerCount}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>자기소개</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="introduction"
            value={form.introduction}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          시작하기 🚀
        </Button>
      </Form>
    </Container>
  );
}
