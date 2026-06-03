import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import Index from "./pages/Index";

const Obrigado = lazy(() => import("./pages/Obrigado"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <LazyMotion features={domAnimation} strict>
    <BrowserRouter>
      <Suspense>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/obrigado" element={<Obrigado />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </LazyMotion>
);

export default App;
