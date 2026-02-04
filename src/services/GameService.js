
const GameService = async () => {
    const response = await fetch('http://localhost:3000/videojuegos')
    const data = await response.json()
    return data
}

export  default GameService