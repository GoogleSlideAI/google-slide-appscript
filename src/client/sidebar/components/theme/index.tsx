import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Tooltip, Box, Typography } from "@mui/material";
import { LIST_OF_THEMES } from "./constants";

interface ThemeSelectProps {
  value?: string;
  onValueChange?: (themeData: any) => void;
  template?: string;
  layout?: string;
}

const ThemeSelect = ({ value, onValueChange, template, layout }: ThemeSelectProps) => {
  const handleClick = (theme: any) => {
    if (onValueChange) onValueChange(theme);
  };

  const filteredThemes = LIST_OF_THEMES.filter(theme => {
    // If no filters are applied, show all themes
    if (template === "Default Template" && layout === "All layouts") {
      return true;
    }

    // Apply template filter
    if (template !== "Default Template") {
      const templateStyle = template?.toLowerCase().replace(" template", "");
      if (theme.presentationStyle !== templateStyle) {
        return false;
      }
    }

    // Apply layout filter
    if (layout !== "All layouts") {
      const layoutStyle = layout?.toLowerCase().replace(" ", "-");
      if (theme.layout !== layoutStyle) {
        return false;
      }
    }

    return true;
  });

  return (
    <Box sx={{overflow: 'auto'}}>
      <Typography
        variant="body2"
        sx={{ 
          mb: 0.5, 
          fontWeight: 500, 
          color: "#5F5F5F" 
        }}
      >
        Theme
      </Typography>
      <ImageList 
        cols={1} 
        gap={6}
        sx={{ 
          margin: 0,
          gap: 2,
          minHeight: 200, // Add minimum height to prevent layout shift
        }}
      >
        {filteredThemes.length > 0 ? (
          filteredThemes.map((theme) => (
            <Tooltip 
              title={theme.label} 
              key={theme.id} 
              followCursor={true}
              placement="top"
              sx={{ padding: 1 }}
            >
              <ImageListItem
                onClick={() => handleClick(theme)}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: value === theme.id ? '2px solid #2563eb' : '1px solid #e0e0e0',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <img
                  src={theme.image}
                  alt={theme.label}
                  loading="lazy"
                  style={{
                    width: '100%',
                    objectFit: 'cover'
                  }}
                />
              </ImageListItem>
            </Tooltip>
          ))
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            color: '#666',
            py: 4,
            borderRadius: 1,
            border: '1px dashed #ccc'
          }}>
            No themes match the selected filters
          </Box>
        )}
      </ImageList>
    </Box>
  );
};

export default ThemeSelect;