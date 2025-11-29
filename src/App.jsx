import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Explorer from './components/Explorer';
import CampaignWizard from './components/CampaignWizard';
import ClusterMap3D from './components/ClusterMap3D';

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Explorer />} />
            <Route path="/wizard" element={<CampaignWizard />} />
            <Route path="/3d" element={<ClusterMap3D />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;