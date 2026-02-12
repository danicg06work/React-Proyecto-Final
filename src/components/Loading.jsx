import './Loading.css'

const Loading = ({ text = 'Cargando...' }) => {
  return (
    <div className="loading-box" role="status" aria-live="polite">
      <div className="loading-dot" />
      <p>{text}</p>
    </div>
  )
}

export default Loading
