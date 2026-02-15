import { Tooltip, Typography } from "@mui/material";

const EllipsisText = ({ text, sx = {}, ...props }) => {
  return (
    <Tooltip title={text || ""} arrow>
      <Typography
        noWrap
        sx={{
          maxWidth: 180,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...sx
        }}
        {...props}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

export default EllipsisText;
