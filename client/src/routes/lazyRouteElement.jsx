import { Suspense } from "react";
import PropTypes from "prop-types";

export const LazyRouteElement = ({ component: Component, fallback }) => (
  <Suspense fallback={fallback}>
    <Component />
  </Suspense>
);

LazyRouteElement.propTypes = {
  component: PropTypes.elementType.isRequired,
  fallback: PropTypes.node.isRequired,
};
