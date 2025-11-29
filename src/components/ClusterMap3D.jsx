import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import { useData } from '../context/DataContext';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';

function ClusterNode({ position, label, onClick, isSelected }) {
  const mesh = useRef();
  
  useFrame((state) => {
    // Subtle float animation
    if(mesh.current) {
        mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh position={position} ref={mesh} onClick={onClick}>
      <sphereGeometry args={[isSelected ? 0.8 : 0.4, 32, 32]} />
      <meshStandardMaterial color={isSelected ? "#ff0055" : "#0088FE"} />
      {isSelected && (
        <Html distanceFactor={10}>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '5px', borderRadius: '4px', fontSize: '10px', width: '100px' }}>
            {label}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Scene() {
  const { clusters, articles } = useData();
  const [selectedCluster, setSelectedCluster] = useState(null);

  // Get articles for the selected cluster
  const activeArticles = useMemo(() => {
    if (!selectedCluster) return [];
    return articles.filter(a => a.topic_clusters.some(tc => tc.id === selectedCluster.id)).slice(0, 5);
  }, [selectedCluster, articles]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Clusters */}
      {clusters.map((cluster) => (
        <ClusterNode 
          key={cluster.id} 
          position={cluster.vector} 
          label={cluster.label}
          isSelected={selectedCluster?.id === cluster.id}
          onClick={(e) => { e.stopPropagation(); setSelectedCluster(cluster); }}
        />
      ))}

      {/* UI Overlay via Html (Drei) or external React state (better for sidebar) */}
      {selectedCluster && (
        <Html position={[15, 0, 0]} as='div' center>
           {/* This is a 3D overlay, usually better to handle this outside Canvas, but demonstrated here for integration */}
        </Html>
      )}
      <OrbitControls autoRotate={!selectedCluster} autoRotateSpeed={0.5} />
    </>
  );
}

export default function ClusterMap3D() {
    const { articles } = useData();
    // Helper to pass selected info out of canvas if needed, simplified here
    return (
        <Box sx={{ width: '100%', height: '80vh', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
                <Scene />
            </Canvas>
            <Box sx={{ position: 'absolute', top: 20, left: 20, pointerEvents: 'none' }}>
                <Typography variant="h5" sx={{ color: 'white', textShadow: '1px 1px 2px black' }}>
                    Cluster Universe ({articles.length} articles)
                </Typography>
                <Typography variant="body2" sx={{ color: '#ccc' }}>
                    Click on nodes to inspect clusters
                </Typography>
            </Box>
        </Box>
    );
}