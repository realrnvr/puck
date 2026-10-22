import { axe } from "vitest-axe";
import { expect } from "vitest";

const seriousImpacts = new Set(["serious", "critical"]);

export const expectNoSeriousA11yViolations = async (container) => {
  const results = await axe(container, {
    rules: {
      // jsdom cannot compute rendered colors, so contrast is checked manually.
      "color-contrast": { enabled: false },
    },
  });
  const violations = results.violations
    .filter(({ impact }) => seriousImpacts.has(impact))
    .map(({ id, help, nodes }) => ({
      id,
      help,
      targets: nodes.map((node) => node.target),
    }));

  expect(violations).toEqual([]);
};
