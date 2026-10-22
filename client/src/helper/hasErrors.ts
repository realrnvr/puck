export const hasErrors = (errors: object): boolean => {
  return Object.values(errors).length > 0;
};
