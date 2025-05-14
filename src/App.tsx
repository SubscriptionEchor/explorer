import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { TokenDetails } from './components/TokenDetails';
import { PeerDetails } from './components/PeerDetails';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/token/:tokenId" element={<TokenDetails />} />
        <Route path="/peer/:peerId" element={<PeerDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;