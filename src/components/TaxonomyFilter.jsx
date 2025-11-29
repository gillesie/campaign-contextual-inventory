import React, { useState } from 'react';
import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Checkbox, Collapse, Typography, IconButton 
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// Recursive Tree Item Component
const TaxonomyItem = ({ node, selectedIds, onToggle, level = 0 }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedIds.includes(node.id);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleToggle = () => {
    onToggle(node.id);
  };

  return (
    <>
      <ListItem disablePadding sx={{ pl: level * 2 }}>
        <ListItemButton dense onClick={hasChildren ? handleClick : handleToggle}>
          {hasChildren ? (
             <ListItemIcon sx={{ minWidth: 30 }}>
               {open ? <FolderOpenIcon fontSize="small" /> : <FolderIcon fontSize="small" />}
             </ListItemIcon>
          ) : (
             <ListItemIcon sx={{ minWidth: 30 }}>
               <InsertDriveFileIcon fontSize="small" sx={{ opacity: 0.5 }} />
             </ListItemIcon>
          )}
          
          <ListItemText 
            primary={node.label} 
            primaryTypographyProps={{ variant: 'body2', noWrap: true }} 
            title={node.label}
          />
          
          {/* Checkbox for selection */}
          <Checkbox 
            edge="end"
            checked={isSelected}
            tabIndex={-1}
            disableRipple
            onClick={(e) => { e.stopPropagation(); handleToggle(); }}
            size="small"
          />
          
          {hasChildren && (
            <IconButton size="small" edge="end" onClick={handleClick}>
              {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          )}
        </ListItemButton>
      </ListItem>
      
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children.map((child) => (
              <TaxonomyItem 
                key={child.id} 
                node={child} 
                selectedIds={selectedIds} 
                onToggle={onToggle} 
                level={level + 1} 
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default function TaxonomyFilter({ taxonomy, selectedIds, onSelectionChange }) {
  const handleToggle = (id) => {
    const currentIndex = selectedIds.indexOf(id);
    const newChecked = [...selectedIds];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    onSelectionChange(newChecked);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
      <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle2" fontWeight="bold">IAB Content Taxonomy v3.1</Typography>
      </Box>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', maxHeight: 400, overflowY: 'auto' }}>
        {taxonomy.map((node) => (
          <TaxonomyItem 
            key={node.id} 
            node={node} 
            selectedIds={selectedIds} 
            onToggle={handleToggle} 
          />
        ))}
      </List>
    </Box>
  );
}