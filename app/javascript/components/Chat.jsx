import { useEffect, useRef } from "react";

export default function Chat({ messages = [{ actor: "Thang", text: "Hello World" }], sendMessageHandler }) {
  const inputRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) dialog.scrollTop = dialog.scrollHeight;
  }, [messages]);

  function submitHandler(event) {
    event.preventDefault();
    const input = inputRef.current;
    const msg = input.value;
    if (msg) {
      sendMessageHandler?.(msg);
      input.value = "";
      input.focus();
    }
  }

  return (
    <div className="chat-window">
      <h4>Chat windows</h4>
      <div id="theDialogue" ref={dialogRef}>
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            {msg.actor}: {msg.text}
          </div>
        ))}
      </div>
      <h4>Your message:</h4>
      <form className="form-message horizontal-form" id="mainfrm" onSubmit={submitHandler}>
        <div className="form-group">
          <textarea className="form-control" id="input" ref={inputRef} rows="3"></textarea>
        </div>
        <div className="form-group">
          <input type="submit" value="Send" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
