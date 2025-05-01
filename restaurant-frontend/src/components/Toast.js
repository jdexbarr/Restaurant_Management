import './Toast.css';

function Toast({ message, onClose }) {
  return (
    <div className="toast-container">
      <div className="toast">
        {message}
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}

export default Toast;


