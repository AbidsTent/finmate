import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Expenses from "./pages/Expenses";
import Investments from "./pages/Investments";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="investments" element={<Investments />} />
      </Route>
    </Routes>
  );
}