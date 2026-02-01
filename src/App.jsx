import './App.css'
import Header from './components/Header'
import CategoryMenu from './components/CategoryMenu'
function App() {
  

  return (
    <div className="app-container">
      <Header />
      <main className="container">
        <CategoryMenu></CategoryMenu>
      </main>
    </div>
  )
}

export default App
