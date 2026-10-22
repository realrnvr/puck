class ContextErrorAPI extends Error {
  statusCode?: number;
  type?: string | null;
}

export default ContextErrorAPI;
