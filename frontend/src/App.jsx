import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ExpensePage from "./pages/ExpensePage";
import InvestmentPage from "./pages/InvestmentPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/investments" element={<InvestmentPage />} />
      </Routes>
    </>
  );
}

export default App;