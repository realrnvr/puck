import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { axiosInstance } from "../services/api/axios";
import MangaCard from "./ui/mangaCard/MangaCard";

const MangaLazyCard = ({ mangaId, title, authorId }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["manga-cover", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${mangaId}`),
    enabled: inView,
  });

  return (
    <div ref={ref}>
      <MangaCard
        img={data?.data?.coverImgUrl}
        title={title}
        mangaId={mangaId}
        authorId={authorId}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MangaLazyCard;
