
import { useEffect, useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function RoleBasedNavbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const uid = currentUser.uid;

        const ownerDoc = await getDoc(doc(db, "owners", uid));
        const influencerDoc = await getDoc(doc(db, "users", uid));

        if (ownerDoc.exists()) {
          setRole("owner");
        } else if (influencerDoc.exists()) {
          setRole("influencer");
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const goToDashboard = () => {
    if (role === "owner") navigate(`/dashboard/${user.uid}`);
    if (role === "influencer") navigate(`/dashboard-influencer/${user.uid}`);
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <strong>푸디매치 🍽️</strong>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="role-navbar" />
        <Navbar.Collapse id="role-navbar">
          <Nav className="ms-auto">
            {!user ? (
              <>
                <Nav.Link onClick={() => navigate("/login")}>로그인</Nav.Link>
                <Nav.Link onClick={() => navigate("/")}>회원가입</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={goToDashboard}>마이페이지</Nav.Link>
                <Nav.Link onClick={handleLogout}>로그아웃</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
