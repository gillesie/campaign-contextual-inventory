{
type: "file",
fileName: "gillesie/campaign-contextual-inventory/campaign-contextual-inventory-af3bfaf163e0aba7124c83f02bd858f2445d3f72/src/data/mockGenerator.js",
content: `
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { IAB_TAXONOMY_V3 } from './iabTaxonomy';

// --- Constants ---
const BRANDS_BE = ['HLN', 'De Morgen', 'Humo', 'Dag Allemaal', 'VT Wonen', 'Mijn Energie', 'VTM', 'Tweakers BE'];
const BRANDS_NL = ['Indebuurt', 'Volkskrant', 'Parool', 'Nu.nl', 'Tweakers', 'Ouders van Nu', 'Libelle', 'Margriet'];
const GARM_CATEGORIES = [
  'Adult & Explicit Sexual Content', 'Arms & Ammunition', 'Crime & Harmful Acts to Individuals',
  'Death, Injury & Military Conflict', 'Online Piracy', 'Hate Speech & Acts of Aggression',
  'Obscenity and Profanity', 'Illegal Drugs', 'Sensitive Social Issues', 'Terrorism'
];

export { IAB_TAXONOMY_V3 };

// Flatten taxonomy for easy random picking
const flattenTaxonomy = (nodes, result = []) => {
  nodes.forEach(node => {
    result.push({ id: node.id, label: node.label });
    if (node.children) flattenTaxonomy(node.children, result);
  });
  return result;
};
const FLAT_IAB = flattenTaxonomy(IAB_TAXONOMY_V3);

// --- Generators ---

// Generate 500 Fictive Clusters
export const generateClusters = () => {
  const clusters = [];
  const adjectives = ['Modern', 'Digital', 'Sustainable', 'Urban', 'Family', 'Budget', 'Luxury', 'Tech', 'Green', 'Healthy', 'Global', 'Local', 'Smart', 'Creative'];
  const nouns = ['Living', 'Mobility', 'Finance', 'Parenting', 'Gadgets', 'Travel', 'Dining', 'Wellness', 'Renovation', 'Politics', 'Education', 'Entertainment'];
  
  for (let i = 0; i < 500; i++) {
    const label = \`\${adjectives[i % adjectives.length]} \${nouns[i % nouns.length]} \${Math.floor(i/10)}\`;
    clusters.push({
      id: \`cluster_\${i}\`,
      label: label,
      vector: [Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10]
    });
  }
  return clusters;
};

// Generate Impressions History
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
    
    // Pick Brands
    const numBrands = Math.floor(Math.random() * 3) + 1;
    const articleBrands = availableBrands.sort(() => 0.5 - Math.random()).slice(0, numBrands);

    // Pick Topic Clusters
    const numClusters = Math.floor(Math.random() * 3) + 1;
    const selectedClusters = clusters.sort(() => 0.5 - Math.random()).slice(0, numClusters)
      .map(c => ({ id: c.id, label: c.label, score: (Math.random() * 0.5 + 0.5).toFixed(2) }));

    // Pick IAB Tags (from new taxonomy)
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = FLAT_IAB.sort(() => 0.5 - Math.random()).slice(0, numTags)
      .map(t => ({ id: t.id, label: t.label, score: (Math.random() * 0.5 + 0.5).toFixed(2) }));

    const safetyLabel = GARM_CATEGORIES[Math.floor(Math.random() * GARM_CATEGORIES.length)];
    const { history, total } = generateImpressions();

    articles.push({
      id: uuidv4(),
      title: \`\${selectedTags[0]?.label || 'General'} News: \${selectedClusters[0]?.label}\`,
      author: \`Editor \${Math.floor(Math.random() * 100)}\`,
      country,
      brands: articleBrands,
      topic_clusters: selectedClusters,
      iab_tags: selectedTags,
      brand_safety: [{ label: safetyLabel, risk: Math.random() > 0.8 ? 'High' : 'Low' }],
      total_impressions: total,
      vector: [0,0,0] // Simplified
    });
  }
  return articles;
};
`
}