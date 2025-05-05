import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function OwnerList() {
  const [owners, setOwners] = useState([]);
  const navigate = useNavigate();

  // 🔄 Firestore에서 owner 목록 불러오기
  const fetchOwners = async () => {
    const querySnapshot = await getDocs(collection(db, "owners"));
    const list = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    setOwners(list);
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  // ❌ 삭제 기능 (Firestore 기반)
  const handleDelete = async (docId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDoc(doc(db, "owners", docId));
        alert("삭제되었습니다.");
        fetchOwners();
      } catch (err) {
        console.error("삭제 오류:", err);
        alert("삭제 실패!");
      }
    }
  };

  // ✏️ 수정 기능
  const handleEdit = (docId) => {
    navigate(`/edit-owner/${docId}`);
  };

  return (
    <Container className="py-5">
      <h3 className="mb-4">📋 등록된 사업자 목록</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>사업자명</th>
            <th>가게명</th>
            <th>업종</th>
            <th>주소</th>
            <th>소개</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((o, i) => (
            <tr key={o.id}>
              <td>{i + 1}</td>
              <td>{o.ownerName}</td>
              <td>{o.shopName}</td>
              <td>{o.category}</td>
              <td>{o.address}</td>
              <td>{o.description}</td>
              <td>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleEdit(o.id)}
                  className="me-2"
                >
                  수정
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(o.id)}
                >
                  삭제
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
