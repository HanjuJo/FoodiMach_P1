import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function BidProposalModal({ show, onClose, onSubmit }) {
  const [form, setForm] = useState({
    message: "",
    budget: "",
    duration: "",
    sns: "",
    phone: "",
    concept: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form); // 상위 컴포넌트에서 Firestore 저장
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>입찰 제안 보내기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>제안 메시지</Form.Label>
            <Form.Control as="textarea" rows={3} name="message" value={form.message} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>SNS 주소</Form.Label>
            <Form.Control type="text" name="sns" value={form.sns} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>전화번호 (비공개)</Form.Label>
            <Form.Control type="text" name="phone" value={form.phone} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>제안 비용 (₩)</Form.Label>
            <Form.Control type="number" name="budget" value={form.budget} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>희망 기간 (일)</Form.Label>
            <Form.Control type="number" name="duration" value={form.duration} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>촬영 컨셉</Form.Label>
            <Form.Control type="text" name="concept" value={form.concept} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>취소</Button>
        <Button variant="primary" onClick={handleSubmit}>제안 보내기</Button>
      </Modal.Footer>
    </Modal>
  );
}
