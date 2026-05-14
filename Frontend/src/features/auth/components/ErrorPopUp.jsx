// ErrorPopUp.jsx
import '../styles/errorPopUp.css'

function ErrorPopUp({ message, onClose }) {
  if (!message) return null

  return (
    <div className="popup-overlay show">
      <div className="popup">
        
        <div className="popup-title">Something went wrong</div>
        <div className="popup-msg">{message}</div>
        <button className="popup-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  )
}

export default ErrorPopUp