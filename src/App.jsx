import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ProposalForm from './components/ProposalForm'
import PaymentPage from './components/PaymentPage'
import ProposalView from './components/ProposalView'
import EnvCheck from './components/EnvCheck'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<ProposalForm />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/proposal/view/:token" element={<ProposalView />} />
        <Route path="/proposal/magic/:magicLink" element={<PaymentPage />} />
      </Routes>
      <EnvCheck />
    </div>
  )
}

export default App
