import { BrowserRouter, Route, Routes, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage";
import { ResultsPage } from "./pages/ResultsPage";
import { ComparePage } from "./pages/ComparePage";
import type { Audience, PresetKey, ScoredDistrict } from "./lib/types";

function ResultsPageWrapper() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [compareDistricts, setCompareDistricts] = useState<
    [ScoredDistrict, ScoredDistrict] | null
  >(null);

  const state = searchParams.get("state") || "NY";
  const audience = (searchParams.get("audience") || "parent") as Audience;
  const preset = (searchParams.get("preset") || "academic") as PresetKey;

  if (compareDistricts) {
    return (
      <ComparePage
        districts={compareDistricts}
        onBack={() => setCompareDistricts(null)}
      />
    );
  }

  return (
    <ResultsPage
      state={state}
      audience={audience}
      preset={preset}
      onBack={() => navigate("/")}
      onCompare={(districts) => setCompareDistricts(districts)}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
