import React, { useState, useMemo } from 'react';
import { 
  Box, Typography, TextField, Chip, Autocomplete, Checkbox 
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ClusterFilter({ clusters, selectedIds, onSelectionChange }) {
  // Memoize the selected objects to control Autocomplete value
  const selectedValues = useMemo(() => {
    return clusters.filter(c => selectedIds.includes(c.id));
  }, [clusters, selectedIds]);

  return (
    <Box sx={{ width: '100%', mt: 2, bgcolor: 'background.paper', border: '1px solid #e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
      <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle2" fontWeight="bold">Topic Clusters</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Autocomplete
          multiple
          id="cluster-filter"
          options={clusters}
          disableCloseOnSelect
          getOptionLabel={(option) => option.label}
          value={selectedValues}
          onChange={(event, newValue) => {
            onSelectionChange(newValue.map(v => v.id));
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} label="Search Clusters" placeholder="Select..." variant="outlined" size="small" />
          )}
          renderTags={(value, getTagProps) =>
            value.slice(0, 3).map((option, index) => (
              <Chip label={option.label} size="small" {...getTagProps({ index })} />
            ))
          }
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {selectedIds.length > 0 ? `${selectedIds.length} clusters selected` : 'No clusters selected'}
        </Typography>
      </Box>
    </Box>
  );
}