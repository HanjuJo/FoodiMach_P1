import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 🔍 1단계: owners 컬렉션에서 조회 (사장님용)
      const ownerDoc = await getDoc(doc(db, "owners", uid));
      if (ownerDoc.exists()) {
        navigate(`/dashboard/${uid}`); // 사장님 대시보드
        return;
      }

      // 🔍 2단계: users 컬렉션에서 조회 (인플루언서용)
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.role === "influencer") {
          navigate(`/dashboard-influencer/${uid}`);
        } else {
          alert("등록되지 않은 역할입니다.");
        }
        return;
      }

      // 🔴 둘 다 없으면
      alert("사용자 정보를 찾을 수 없습니다.");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 실패: " + error.message);
    }
  };

  return (
    <Container style={{ maxWidth: "400px", marginTop: "60px" }}>
      <h3 className="mb-4">로그인</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          로그인
        </Button>

        <Button
          variant="link"
          onClick={() => navigate("/register")}
          className="w-100 mt-2"
        >
          계정이 없으신가요? 회원가입 →
        </Button>
      </Form>
    </Container>
  );
}
