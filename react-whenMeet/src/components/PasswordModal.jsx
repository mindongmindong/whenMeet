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
      padding: "20px 20px 0 20px",
    },
  };
  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="비밀번호 입력"
      style={customStyles}
    >
      <h2 style={{ justifyContent: "center" }}>관리자 비밀번호를 입력하세요</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        style={{ margin: "15px 0 0 0" }}
      />
      <div style={buttonContainerStyle}>
        <button onClick={handleSubmit} style={{ margin: "0 10px" }}>
          확인
        </button>
        <button onClick={onRequestClose} style={{ margin: "0 10px" }}>
          취소
        </button>
      </div>
    </Modal>
  );
}

export default PasswordModal;
