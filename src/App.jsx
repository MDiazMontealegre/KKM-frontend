import { Outlet } from 'react-router-dom'
import './App.css'
import NavBar from './components/navbar/navbar'

function App() {

  return (
    <section id='container'>
      <NavBar></NavBar>
      <main>
        <div className='frame.container'>
          <Outlet></Outlet>
        </div>
      </main>
    </section>
  )
}

export default App;