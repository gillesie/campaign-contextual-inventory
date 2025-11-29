import React, { createContext, useState, useEffect, useContext } from 'react';
import { generateClusters, generateArticles, IAB_TAXONOMY_V3 } from '../data/mockGenerator';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Initialize with the imported taxonomy immediately
  const [data, setData] = useState({ 
    clusters: [], 
    articles: [], 
    taxonomy: IAB_TAXONOMY_V3 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data fetching/generation
    const clusters = generateClusters();
    const articles = generateArticles(clusters);
    
    setData({ 
      clusters, 
      articles, 
      taxonomy: IAB_TAXONOMY_V3 
    });
    setLoading(false);
  }, []);

  return (
    <DataContext.Provider value={{ ...data, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);