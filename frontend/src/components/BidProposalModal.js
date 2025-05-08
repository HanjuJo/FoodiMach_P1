// BidProposalModal.js (추가)
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function BidProposalModal({ show, onClose, onSubmit }) {
  const [form, setForm] = useState({
    message: "",
    budget: "",
    duration: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
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
            <Form.Control
              as="textarea"
              rows={3}
              name="message"
              value={form.message}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>예산 (₩)</Form.Label>
            <Form.Control
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>희망 기간 (일)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
            />
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
