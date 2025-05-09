// src/pages/EditInfluencer.js
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function EditInfluencer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    influencerName: "",
    email: "",
    platform: "",
    followerCount: "",
    region: "",
    introduction: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setForm(docSnap.data());
      } else {
        alert("해당 인플루언서를 찾을 수 없습니다.");
        navigate("/login");
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
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, form);
      alert("✅ 수정이 완료되었습니다!");
      navigate(`/dashboard-influencer/${id}`);
    } catch (error) {
      console.error("수정 실패:", error);
      alert("❌ 수정 실패. 다시 시도해주세요.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="mb-4">✏️ 인플루언서 정보 수정</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="influencerName">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            name="influencerName"
            value={form.influencerName}
            onChange={handleChange}
            required
          />
        </Form.Group>

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

        <Form.Group className="mb-3" controlId="platform">
          <Form.Label>플랫폼</Form.Label>
          <Form.Control
            type="text"
            name="platform"
            value={form.platform}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="followerCount">
          <Form.Label>팔로워 수</Form.Label>
          <Form.Control
            type="number"
            name="followerCount"
            value={form.followerCount}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="region">
          <Form.Label>활동 지역</Form.Label>
          <Form.Control
            type="text"
            name="region"
            value={form.region}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="introduction">
          <Form.Label>소개</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="introduction"
            value={form.introduction}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit">
            저장
          </Button>
          <Button variant="warning" onClick={() => navigate(`/dashboard-influencer/${id}`)}>
            취소
          </Button>
        </div>
      </Form>
    </Container>
  );
}
