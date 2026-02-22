import './Loading.css'
import { Box, CircularProgress, Typography } from '@mui/material'

const Loading = ({ text = 'Cargando...' }) => {
  return (
    <Box className="loading-box" role="status" aria-live="polite">
      <CircularProgress size={34} thickness={4.2} />
      <Typography variant="body2">{text}</Typography>
    </Box>
  )
}

export default Loading
