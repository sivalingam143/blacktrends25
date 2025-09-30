import React from "react";
import { Buttons } from "./Buttons";

const Dialog = ({ isVisible, onConfirm, onCancel, DialogTitle }) => {
  if (!isVisible) return null;
  return (
    <>
      <div className="confirm-dialog-overlay">
        <div className="confirm-dialog">
          <p>{DialogTitle}</p>
          <button onClick={() => onConfirm(true)} className="yesbtn mx-2">
            Yes
          </button>
          <button onClick={() => onCancel(false)} className="yesbtn mx-2">
            No
          </button>
        </div>
      </div>
    </>
  );
};

export default Dialog;
