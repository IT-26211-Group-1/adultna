"use client";

import React from "react";
import { Skeleton, Box } from "@mui/material";

export default function LoadingSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width={200} height={40} />
      <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={50} sx={{ mt: 2 }} />
    </Box>
  );
}
