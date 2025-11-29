import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

// --- Constants ---
const BRANDS_BE = ['HLN', 'De Morgen', 'Humo', 'Dag Allemaal', 'VT Wonen', 'Mijn Energie', 'VTM', 'Tweakers BE'];
const BRANDS_NL = ['Indebuurt', 'Volkskrant', 'Parool', 'Nu.nl', 'Tweakers', 'Ouders van Nu', 'Libelle', 'Margriet'];
const GARM_CATEGORIES = [
  'Adult & Explicit Sexual Content', 'Arms & Ammunition', 'Crime & Harmful Acts to Individuals',
  'Death, Injury & Military Conflict', 'Online Piracy', 'Hate Speech & Acts of Aggression',
  'Obscenity and Profanity', 'Illegal Drugs', 'Sensitive Social Issues', 'Terrorism'
];
// Simplified IAB v3 Mock (Hierarchical)
export const IAB_TAXONOMY = [
  { id: 'IAB1', name: 'Automotive', children: ['IAB1-1', 'IAB1-2'] },
  { id: 'IAB2', name: 'Books & Literature', children: ['IAB2-1'] },
  { id: 'IAB3', name: 'Business & Finance', children: ['IAB3-1', 'IAB3-8'] },
  { id: 'IAB19', name: 'Technology & Computing', children: ['IAB19-6', 'IAB19-12'] },
  { id: 'IAB17', name: 'Sports', children: ['IAB17-15', 'IAB17-2'] },
];

// --- Generators ---

// Generate 500 Fictive Clusters
export const generateClusters = () => {
  const clusters = [];
  const adjectives = ['Modern', 'Digital', 'Sustainable', 'Urban', 'Family', 'Budget', 'Luxury', 'Tech', 'Green', 'Healthy'];
  const nouns = ['Living', 'Mobility', 'Finance', 'Parenting', 'Gadgets', 'Travel', 'Dining', 'Wellness', 'Renovation', 'Politics'];
  
  for (let i = 0; i < 500; i++) {
    const label = `${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]} ${Math.floor(i/10)}`;
    clusters.push({
      id: `cluster_${i}`,
      label: label,
      // Random 3D coordinates for visualization later
      vector: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10]
    });
  }
  return clusters;
};

// Generate Impressions History (last 30 days for simplicity in mock)
const generateImpressions = () => {
  const history = {};
  let total = 0;
  for(let i=0; i<30; i++) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    const count = Math.floor(Math.random() * 5000) + 100;
    history[date] = count;
    total += count;
  }
  return { history, total };
};

export const generateArticles = (clusters) => {
  const articles = [];
  
  for (let i = 0; i < 2000; i++) {
    const isBE = Math.random() > 0.4;
    const country = isBE ? 'BE' : 'NL';
    const availableBrands = isBE ? BRANDS_BE : BRANDS_NL;
    
    // Pick 1 to 3 brands
    const numBrands = Math.floor(Math.random() * 3) + 1;
    const articleBrands = availableBrands.sort(() => 0.5 - Math.random()).slice(0, numBrands);

    // Pick Topic Clusters
    const numClusters = Math.floor(Math.random() * 5) + 1;
    const selectedClusters = clusters.sort(() => 0.5 - Math.random()).slice(0, numClusters)
      .map(c => ({ id: c.id, label: c.label, score: (Math.random() * 0.5 + 0.5).toFixed(2) }));

    // Pick Brand Safety
    const safetyLabel = GARM_CATEGORIES[Math.floor(Math.random() * GARM_CATEGORIES.length)];
    
    // Impressions
    const { history, total } = generateImpressions();

    articles.push({
      id: uuidv4(),
      title: `Article about ${selectedClusters[0].label}`,
      author: `Editor ${Math.floor(Math.random() * 100)}`,
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      country,
      brands: articleBrands,
      topic_clusters: selectedClusters,
      iab_tags: [{ id: 'IAB19', score: 0.9 }, { id: 'IAB3', score: 0.7 }], // Simplified for mock
      brand_safety: [{ label: safetyLabel, risk: Math.random() > 0.8 ? 'High' : 'Low' }],
      impressions_history: history,
      total_impressions: total,
      // Fake embedding for 3D view (positioned near its primary cluster)
      vector: [
        clusters.find(c => c.id === selectedClusters[0].id).vector[0] + (Math.random() - 0.5),
        clusters.find(c => c.id === selectedClusters[0].id).vector[1] + (Math.random() - 0.5),
        clusters.find(c => c.id === selectedClusters[0].id).vector[2] + (Math.random() - 0.5),
      ]
    });
  }
  return articles;
};