import { useRef } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import './modal.css';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const Modal = ({ show, modalClosed, children, testId }) => {
  const nodeRef = useRef(null);
  return (
    <>
      <Backdrop show={show} clicked={modalClosed} />
      <CSSTransition
        nodeRef={nodeRef}
        in={show}
        timeout={100}
        mountOnEnter
        unmountOnExit
        classNames="modal"
      >
        <div
          ref={nodeRef}
          className={classes.Modal}
          data-testid={testId || 'Modal'}
        >
          {children}
        </div>
      </CSSTransition>
    </>
  );
};

export default Modal;
