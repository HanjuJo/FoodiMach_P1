// src/components/RoleBasedNavbar.js
import { Navbar, Nav, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function RoleBasedNavbar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const fetchRole = async () => {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setRole(snap.data().role);
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <Navbar bg="warning" variant="light" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand
          href="/"
          className="fw-bold"
          style={{ fontFamily: "Pretendard, sans-serif", fontSize: "20px" }}
        >
          🍽️ 푸디매치
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            {role === "owner" && (
              <>
                <Nav.Link href="/owner-list">📃 인플루언서 리스트</Nav.Link>
                <Nav.Link href={`/dashboard/${auth.currentUser?.uid}`}>📊 내 대시보드</Nav.Link>
              </>
            )}
            {role === "influencer" && (
              <>
                <Nav.Link href="/business-list">🏪 사업장 리스트</Nav.Link>
                <Nav.Link href={`/dashboard-influencer/${auth.currentUser?.uid}`}>📊 내 대시보드</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>🚪 로그아웃</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
