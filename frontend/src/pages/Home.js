import { useNavigate } from "react-router-dom";
import { Container, Button } from "react-bootstrap";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "linear-gradient(to bottom, #fffbe6, #ffe8cc)",
        minHeight: "100vh",
        backgroundImage: `url(${process.env.PUBLIC_URL}/hero-food.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top center",
      }}
    >
      <Container className="text-center py-5 px-3" style={{ backgroundColor: "rgba(255, 255, 255, 0.85)", borderRadius: "20px", marginTop: "80px" }}>
        {/* 타이틀 강조 */}
        <p className="text-uppercase text-danger fw-bold mb-1" style={{ letterSpacing: "1px" }}>맛있는 연결, 즐거운 마케팅 🎉</p>

        {/* 로고 */}
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="푸디매치 로고"
          style={{ width: "100%", maxWidth: "120px", marginBottom: "15px" }}
        />

        {/* 타이틀 */}
        <h1 className="fs-3 fw-bold text-success">외식 마케팅, 푸디매치에서 간편하게 🍽️</h1>
        <p className="text-muted mt-2">
          <strong>사장님</strong>과 <strong>SNS 인플루언서</strong>가 만나
          <br />맛있는 협업을 시작합니다!
        </p>

        {/* CTA 버튼 */}
        <div className="d-grid gap-3 mt-4">
          <Button
            variant="warning"
            size="lg"
            onClick={() => navigate("/business")}
          >
            🍜 사장님으로 시작하기
          </Button>
          <Button
            variant="success"
            size="lg"
            onClick={() => navigate("/influencer")}
          >
            🎥 인플루언서로 참여하기
          </Button>

          <Button
  variant="outline-dark"
  onClick={() => navigate("/login")}
  className="mt-3 w-100"
>
  🔐 기존 회원 로그인
</Button>
        </div>

        {/* 단계 설명 */}
        <div className="mt-5 text-start">
          <h5 className="fw-bold">1️⃣ 가게 정보 등록</h5>
          <p className="text-muted">📋 메뉴, 위치, 희망 조건을 입력하세요</p>

          <h5 className="fw-bold">2️⃣ 인플루언서 제안 받기</h5>
          <p className="text-muted">📩 조건에 맞는 SNS 홍보 제안서를 받아보세요</p>

          <h5 className="fw-bold">3️⃣ 매칭 후 마케팅 실행</h5>
          <p className="text-muted">🤝 콘텐츠 제작 & 홍보를 시작해보세요!</p>
        </div>

        {/* 푸터 */}
        <div className="mt-4 text-muted text-center">
          <small>푸디매치 © 2025 | 소상공인의 따뜻한 마케팅 파트너 🍜</small>
        </div>
      </Container>
    </div>
  );
}
