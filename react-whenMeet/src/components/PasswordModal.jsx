import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

function PasswordModal({ isOpen, onRequestClose, onSubmit }) {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSubmit(password);
    setPassword("");
  };
  const customStyles = {
    content: {
      width: "400px", // 모달의 너비
      height: "200px", // 모달의 높이
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="비밀번호 입력"
      style={customStyles}
    >
      <h2>관리자 비밀번호를 입력하세요</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button onClick={handleSubmit}>확인</button>
      <button onClick={onRequestClose}>취소</button>
    </Modal>
  );
}

export default PasswordModal;
