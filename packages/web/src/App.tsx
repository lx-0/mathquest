import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";
import { LiveRegionProvider } from "./components/LiveRegion";
import { AppLayout } from "./components/AppLayout";
import { Home } from "./routes/Home";
import { NotFound } from "./routes/NotFound";

export function App() {
  return (
    <AudioProvider>
      <LiveRegionProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </LiveRegionProvider>
    </AudioProvider>
  );
}
