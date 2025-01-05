import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onSuccess: (data) => {
      if (data?.data?.message) {
        toast.success(data.data.message);
      }
    },
    onError: (error) => {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
    },
  }),
});

export const QueryClientProviderBase = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

QueryClientProviderBase.propTypes = {
  children: PropTypes.node.isRequired,
};
