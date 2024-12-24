import "./list.css";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import { Link, useParams } from "react-router-dom";

const List = () => {
  const { mangaId } = useParams();

  const { data } = useQuery({
    queryKey: ["chapter", { mangaId }],
    queryFn: () => axiosInstance.get(`/api/v1/manga/chapters/${mangaId}`),
  });

  console.log(data);

  return (
    <>
      <div className="list">
        {data?.data?.data?.map((val, idx) => {
          return (
            <Link className="list__link" to={`/viewer/${val.id}`} key={idx}>
              Chapter: {idx + 1}
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default List;
