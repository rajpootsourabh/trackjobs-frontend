import React from "react";
import { Box, Button, Switch, Typography } from "@mui/material";

const FormActions = ({ formik, onCancel, isLoading }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 4,
        pt: 2,
        borderTop: "1px solid #e5e7eb",
      }}
    >
      {/* Left side - Active Toggle */}
      <Box display="flex" alignItems="center">
        <Typography sx={{ minWidth: 45, fontWeight: 500 }}>Status:</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Switch
            checked={formik.values.is_active}
            onChange={(e) => formik.setFieldValue("is_active", e.target.checked)}
            size="small"
            color="success"
          />
          <Typography>{formik.values.is_active ? "Active" : "Inactive"}</Typography>
        </Box>
      </Box>

      {/* Right side - Buttons */}
      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isLoading}
          sx={{ textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          disabled={isLoading || !formik.isValid || !formik.dirty}
          sx={{ textTransform: "none" }}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default FormActions;