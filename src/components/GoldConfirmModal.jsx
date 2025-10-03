import React from "react";
import { Modal, Button } from "react-bootstrap";

const GoldConfirmModal = ({ show, onHide, memberName, wantYes, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gold Membership</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {wantYes ? (
          <p>
            Do you really want to **add Gold membership** for{" "}
            <b>{memberName}</b>?
          </p>
        ) : (
          <p>
            Do you really want to **remove Gold membership** from{" "}
            <b>{memberName}</b>?
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={() => {
            onConfirm();
            onHide();
          }}
        >
          Yes
        </Button>
        <Button variant="secondary" onClick={onHide}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GoldConfirmModal;
