import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { TokenDetails } from './components/TokenDetails';
import { PeerDetails } from './components/PeerDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/token/:tokenId" element={<TokenDetails />} />
        <Route path="/peer/:peerId" element={<PeerDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;