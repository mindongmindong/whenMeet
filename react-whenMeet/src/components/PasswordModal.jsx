import React, { useState } from "react";
import Modal from "react-modal";
import "../styles/ModalStyle.css";

Modal.setAppElement("#root");

function PasswordModal({ isOpen, onRequestClose, onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSubmit(password);
    setPassword("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="비밀번호 입력"
      overlayClassName={"modal-overlay"}
      className={"modal-content"}
    >
      <h2 style={{ justifyContent: "center" }}>관리자 비밀번호를 입력하세요</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        style={{ margin: "15px 0 0 0" }}
      />
      <div>
        <button onClick={handleSubmit} className="button-modal">
          확인
        </button>
        <button onClick={onRequestClose} className="button-modal">
          취소
        </button>
      </div>
    </Modal>
  );
}

export default PasswordModal;
