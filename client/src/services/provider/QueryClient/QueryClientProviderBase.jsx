import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./config/client";
import PropTypes from "prop-types";

export const QueryClientProviderBase = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

QueryClientProviderBase.propTypes = {
  children: PropTypes.node.isRequired,
};
