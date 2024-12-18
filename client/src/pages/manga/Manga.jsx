import "./manga.css";
import { axiosInstance } from "../../services/api/axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Manga = () => {
  const { mangaId, authorId } = useParams();

  const { data: statics } = useQuery({
    queryKey: ["static", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/statics/${mangaId}`),
  });

  const { data: authorData } = useQuery({
    queryKey: ["author", { authorId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/author/${authorId}`),
  });

  const { data: coverImg } = useQuery({
    queryKey: ["coverImg", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${mangaId}`),
  });

  console.log(coverImg);

  return (
    <article className="manga | container">
      <img src={coverImg?.data?.coverImgUrl} alt="" />
      <div className="manga__details">
        <p className="manga__tags">manga</p>
        <p className="manga__tags">
          {statics?.data?.data?.attributes?.publicationDemographic}
        </p>
        <p className="manga__tags">{statics?.data?.data?.attributes?.status}</p>
        <p className="manga__tags">
          {statics?.data?.data?.attributes?.contentRating}
        </p>
      </div>
      <div className="manga__intro">
        <h2 className="manga__title">
          {statics?.data?.data?.attributes?.title?.en}
        </h2>
        <p className="manga__author" style={{ marginBottom: "1rem" }}>
          Created by {authorData?.data?.data?.attributes?.name}
        </p>
        <p className="manga__author">
          {authorData?.data?.data?.attributes?.biography?.en}
        </p>
      </div>
      <div>
        <button className="signup__btn" style={{ backgroundColor: "lime" }}>
          Add to favourites
        </button>
      </div>
      <div>
        <div className="manga__cover-wrapper">
          <img src={coverImg?.data?.coverImgUrl} alt="" />
        </div>
        <div className="manga__word">
          <h4 className="manga__title manga__title--fs">
            {statics?.data?.data?.attributes?.title?.en}
          </h4>
          <p className="manga__description">
            {statics?.data?.data?.attributes?.description?.en}
          </p>
          <button className="signup__btn" style={{ backgroundColor: "lime" }}>
            Read Manga
          </button>
        </div>
      </div>
    </article>
  );
};

export default Manga;
