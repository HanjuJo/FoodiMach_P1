
import { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function RegisterInfluencer() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    influencerName: "",
    platform: "",
    followerCount: "",
    region: "",
    introduction: "",
    snsLink: "",
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

      await setDoc(doc(db, "users", user.uid), {
        influencerName: form.influencerName,
        platform: form.platform,
        followerCount: parseInt(form.followerCount),
        region: form.region,
        introduction: form.introduction,
        snsLink: form.snsLink,
        phone: form.phone,
        email: form.email,
        role: "influencer",
        createdAt: new Date(),
      });

      alert("✅ 인플루언서 등록이 완료되었습니다!");
      navigate(`/dashboard-influencer/${user.uid}`);
    } catch (err) {
      console.error(err);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">📸 인플루언서 회원가입</h3>
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
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            name="influencerName"
            value={form.influencerName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>📱 플랫폼</Form.Label>
          <Form.Select
            name="platform"
            value={form.platform}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="인스타그램">인스타그램</option>
            <option value="유튜브">유튜브</option>
            <option value="틱톡">틱톡</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>팔로워 수</Form.Label>
          <Form.Control
            type="number"
            name="followerCount"
            value={form.followerCount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>지역</Form.Label>
          <Form.Control
            type="text"
            name="region"
            value={form.region}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>소개</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="introduction"
            value={form.introduction}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>SNS 주소</Form.Label>
          <Form.Control
            type="url"
            name="snsLink"
            placeholder="https://instagram.com/..."
            value={form.snsLink}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>전화번호</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            placeholder="010-1234-5678"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          등록 완료
        </Button>
      </Form>
    </Container>
  );
}
