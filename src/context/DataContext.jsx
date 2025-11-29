import React, { createContext, useState, useEffect, useContext } from 'react';
import { generateClusters, generateArticles, IAB_TAXONOMY } from '../data/mockGenerator';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({ clusters: [], articles: [], taxonomy: IAB_TAXONOMY });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data fetching/generation
    const clusters = generateClusters();
    const articles = generateArticles(clusters);
    setData({ clusters, articles, taxonomy: IAB_TAXONOMY });
    setLoading(false);
  }, []);

  return (
    <DataContext.Provider value={{ ...data, loading }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);