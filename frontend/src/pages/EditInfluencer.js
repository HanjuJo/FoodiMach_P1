import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Container, Form, Button } from "react-bootstrap";

export default function EditInfluencer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    influencerName: "",
    platform: "",
    followerCount: "",
    introduction: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setForm(docSnap.data());
      } else {
        alert("사용자 정보를 불러올 수 없습니다.");
        navigate("/");
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
          <Form.Label>SNS 플랫폼</Form.Label>
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
            rows={3}
            name="introduction"
            value={form.introduction}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="success" type="submit">
          저장
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate(`/dashboard-influencer/${id}`)}>
          취소
        </Button>
      </Form>
    </Container>
  );
}
