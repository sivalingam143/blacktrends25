import React from "react";
import PageTitle from "./PageTitle";
import Modal from "react-bootstrap/Modal";
import { Buttons } from "./Buttons";

const CustomModal = ({
  show,
  setShow,
  pageTitle,
  showButton,
  submitButton,
  submitLabel,
  CancelLabel,
  BodyComponent,
  OnClick,
  Size,
  handleClose,
  Scroll
}) => {
  const handleModalClose = () => {
    setShow(false);
    if (handleClose) {
      handleClose();
    }
  };
  return (
    <div>
      <Modal
        show={show}
        onHide={handleModalClose}
        size={Size}
        backdrop="static"
        scrollable={Scroll}
      >
        <div className="p-3 border-bottom">
        <PageTitle PageTitle={pageTitle} showButton={showButton} CloseClick={handleModalClose} />
        </div>
        <Modal.Body>{BodyComponent}</Modal.Body>
        {submitButton && (
          <Modal.Footer>
            <>
              <Buttons
                onClick={handleModalClose}
                btnlabel={CancelLabel}
                className="submit-btn"
              />
              <Buttons onClick={OnClick} btnlabel={submitLabel} className="submit-btn" />
            </>
          </Modal.Footer>
        )}
      </Modal>
    </div>
  );
};

export default CustomModal;
