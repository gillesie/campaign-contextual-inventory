export const APP_REQUIREMENTS = `
Target user: online campaign specialist, creates online campaigns on the DPG Media network BE and NL. We create this application to allow him to explore the Contextual targeting inventory reach.

Underlying data-model:
- a long list of publishing brands for BE and NL (fetch these online, examples for BE: HLN, De Morgen, Humo, Dag Allemaal, VT Wonen, mijn energie, .... and for NL: Indebuurt, VK, Parool, Nu.nl, Tweakers, ourders van nu, ...). These are between 50 and 100 brands
- articles: for news brands, some articles are published on 1, many on multiple brands (within the same country)
- article has: author, title, body, has 1 or more IAB content v3.1 tags attached to it, and 1 to 5 topic_clusters attached. For each IAB Content tag and topic_cluster there is a score between 0,0 and 1.0 (we expect scores at the high end, as it is the top X of IAB content tags and topic_clusters for an article)
- it has 1 or more brand safety labels attached with a low, medium or high score for every label
- it has an embedding (vector representation for search)
- it has a number of impressions per day since the day published up-to today (take today as 29/11/2025)
- the content v3.1 IAB tags are listed here: https://github.com/InteractiveAdvertisingBureau/Taxonomies/blob/develop/Content%20Taxonomies/Content%20Taxonomy%203.1.tsv (these can be stored in the project and used as hierarchical taxonomy)
- the topic_clusters is a list of 500 clusters which are the result of a ML model which took the full database of million articles, took an embedding vector representation, then applied a ML unsupervised clustering model for 500 clusters, then applied labelling via an LLM by taking for each cluster a set of articles and asked the LLM to apply a label to it ("Prompt: apply a human readible label which summarized well the overarchic topic for these articles. e.g.: "Living outdoors, Nerd gadgets, ...". Hence topic_clusters is a flat list of 500 clusters, each has a label and list of articles linked to it (with score between 0.0 and 0.1 for each article in the cluster).
- brandsafety labels: use the GARM categories (10-20 brandsafety labels)

Application specifics:
(1) user can explore the inventory by selecting nodes in IAB v3 or topic_clusters. Handy text search. Filters: country, brands, daterange, brandsafety.
(2) Campaign description: User input text area to specifiy a campaign description and a country dropdown. Search proposes list of IAB v3 Content and topic_clusters.
(3) A 3D Exploration of the 500 clusters.
`;

export default APP_REQUIREMENTS;