export const getMangaView = ({ statics, authorData, coverImg } = {}) => {
  const attributes = statics?.data?.data?.attributes ?? {};
  const authorAttributes = authorData?.data?.data?.attributes ?? {};

  return {
    title: attributes.title?.en,
    altTitleJa: attributes.altTitleJa,
    authorName: authorAttributes.name,
    coverUrl: coverImg?.data?.coverImgUrl,
    publicationYear: attributes.year || "---",
    publicationStatus: attributes.status || "---",
    demographic: attributes.publicationDemographic,
    contentRating: attributes.contentRating,
    tags: Array.isArray(attributes.tags) ? attributes.tags : [],
    links: attributes.links ?? {},
    altTitles: Array.isArray(attributes.altTitles) ? attributes.altTitles : [],
  };
};

export const isDexApiError = (error) =>
  error?.response?.data?.type === "dex-api-error";
