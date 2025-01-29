export const setCacheHeaders = ({
  res,
  cacheStatus,
  ttl,
  cType = "application/json",
}) => {
  res?.set("X-Cache", cacheStatus); // Cache hit/miss status
  res?.set("Cache-Control", `public, max-age=${ttl}`); // Dynamic cache expiry
  res?.set("Content-Type", cType); // Content type
};
