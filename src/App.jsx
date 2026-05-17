import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import DecisionTreePage from './pages/DecisionTreePage'
import FormPage from './pages/forms/FormPage'
import IncomePage from './pages/guides/IncomePage'
import DeductionsPage from './pages/guides/DeductionsPage'
import ProceduresPage from './pages/procedures/ProceduresPage'
import ReferencePage from './pages/reference/ReferencePage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="selector" element={<DecisionTreePage />} />
          <Route path="forms/:formId" element={<FormPage />} />
          <Route path="income/:guideId?" element={<IncomePage />} />
          <Route path="deductions/:sectionId?" element={<DeductionsPage />} />
          <Route path="procedures/:procedureId?" element={<ProceduresPage />} />
          <Route path="reference/:sectionId?" element={<ReferencePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
