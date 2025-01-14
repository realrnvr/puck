import "./favourite.css";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import MangaCardSkeleton from "../../utils/skeletons/MangaCard/MangaCardSkeleton";
import { useAuth } from "../../hooks/useAuth";

const Favourite = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["all-favourites"],
    queryFn: () => axiosInstance.get("/api/v1/client/all-favourites"),
    enabled: !!user,
  });

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
      {isLoading ? <MangaCardSkeleton count={5} /> : null}
    </article>
  );
};

export default Favourite;
