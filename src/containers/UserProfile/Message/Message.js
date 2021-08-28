import { useRef } from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import classes from './Message.module.css';
import './Message.css';

const Message = ({ messageText, show }) => {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={show}
      timeout={300}
      mountOnEnter
      unmountOnExit
      classNames="Fade"
    >
      <div ref={nodeRef} className={classes.Message}>
        {messageText}
      </div>
    </CSSTransition>
  );
};

export default Message;
