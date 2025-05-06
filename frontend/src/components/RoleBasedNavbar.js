import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

function Navbar() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;

        // role 확인
        const ownerSnap = await getDoc(doc(db, "owners", uid));
        const influencerSnap = await getDoc(doc(db, "users", uid));

        if (ownerSnap.exists()) {
          setUserInfo({ uid, role: "owner" });
        } else if (influencerSnap.exists()) {
          setUserInfo({ uid, role: "influencer" });
        }
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserInfo(null);
    sessionStorage.clear(); // 혹은 localStorage.clear();
    navigate("/", { replace: true }); // 뒤로가기 시 로그인 페이지 유지
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light fixed-top shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="/">푸디매치</a>
        <div className="d-flex">
          {userInfo ? (
            <>
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => {
                  const dashboardPath =
                    userInfo.role === "owner"
                      ? `/dashboard/${userInfo.uid}`
                      : `/dashboard-influencer/${userInfo.uid}`;
                  navigate(dashboardPath);
                }}
              >
                MyPage
              </button>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
