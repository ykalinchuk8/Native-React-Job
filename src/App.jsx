import React from "react";
import { Container } from "@mui/material";
import DataViewer from "./components/DataViewer";
function App() {
  return (
    <Container maxWidth={false}>
      <DataViewer />
    </Container>
  );
}

export default App;
