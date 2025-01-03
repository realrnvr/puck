import { useQuery } from "@tanstack/react-query";
import "./favourite.css";
import { axiosInstance } from "../../services/api/axios";
import MangaCard from "../../components/ui/mangaCard/MangaCard";

const Favourite = () => {
  const { data } = useQuery({
    queryKey: ["all-favourites"],
    queryFn: () => axiosInstance.get("/api/v1/client/all-favourites"),
  });

  console.log(data);

  return (
    <article className="mangas__container | container">
      {data?.data?.client?.map((val, idx) => {
        return (
          <MangaCard
            key={idx}
            img={val?.coverUrl}
            title={val?.mangaTitle}
            mangaId={val?.mangaId}
            authorId={val?.authorId}
          />
        );
      })}
    </article>
  );
};

export default Favourite;
