import React from "react";
import { Modal, Button } from "react-bootstrap";

const GoldConfirmModal = ({
  show,
  onHide,
  memberName,
  wantYes,
  isExpired,
  onConfirm,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Gold Membership</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {wantYes ? (
          <p>
            {isExpired ? (
              <>
                Do you really want to **renew Gold membership** for{" "}
                <b>{memberName}</b>? (Resets 1 year from now)
              </>
            ) : (
              <>
                Do you really want to **add Gold membership** for{" "}
                <b>{memberName}</b>?
              </>
            )}
          </p>
        ) : (
          <p>
            Do you really want to **remove Gold membership** from{" "}
            <b>{memberName}</b>? (Allowed only after expiry)
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
