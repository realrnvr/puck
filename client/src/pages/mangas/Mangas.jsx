import "./mangas.css";
import { useQueries } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import MangaCard from "../../components/ui/mangaCard/MangaCard";
import { Link } from "react-router-dom";

const Mangas = () => {
  const caseManga = [
    {
      img: "berserk-manga-cover",
      title: "Berserk",
      mangaId: "801513ba-a712-498c-8f57-cae55b38cc92",
      authorId: "5863578d-4e4f-4b57-b64d-1dd45a893cb0",
    },
    {
      img: "vaga-bond-manga-cover",
      title: "Vaga Bond",
      mangaId: "d1a9fdeb-f713-407f-960c-8326b586e6fd",
      authorId: "0b59098f-13c0-41cb-a110-9cbcec72dc0c",
    },
    {
      img: "vinland-saga-manga-cover",
      title: "Vinland Saga",
      mangaId: "5d1fc77e-706a-4fc5-bea8-486c9be0145d",
      authorId: "f5d4fca1-d573-4383-af08-c06b0794ba4e",
    },
    {
      img: "monster-manga-cover",
      title: "Monster",
      mangaId: "d9e30523-9d65-469e-92a2-302995770950",
      authorId: "508631f5-09de-4ae1-87ed-4b6179254ca1",
    },
    {
      img: "naruto",
      title: "Naruto",
      mangaId: "6b1eb93e-473a-4ab3-9922-1a66d2a29a4a",
      authorId: "7f718dfa-e5be-45ea-a5cb-0fcd3ed52d5f",
    },
    {
      img: "death note",
      title: "Death Note",
      mangaId: "75ee72ab-c6bf-4b87-badd-de839156934c",
      authorId: "0669bf79-ca27-4f50-9b48-741fb235137f",
    },
    {
      img: "hunter x hunter",
      title: "Hunter X Hunter",
      mangaId: "db692d58-4b13-4174-ae8c-30c515c0689c",
      authorId: "00345ac8-e515-458d-a11d-56cfd1cb253b",
    },
    {
      img: "aot",
      title: "Attack On Titan",
      mangaId: "304ceac3-8cdb-4fe7-acf7-2b6ff7a60613",
      authorId: "31e059c9-6040-4765-b7bd-40a16d657a94",
    },
    {
      img: "ds",
      title: "Demon Slayer",
      mangaId: "789642f8-ca89-4e4e-8f7b-eee4d17ea08b",
      authorId: "f0efa2ab-6e78-4f21-ad30-bbf2cf38972d",
    },
    {
      img: "bleach",
      title: "Bleach",
      mangaId: "239d6260-d71f-43b0-afff-074e3619e3de",
      authorId: "246984d8-340d-4544-871b-c962da4bb28b",
    },
    {
      img: "pm",
      title: "Psycho Mob",
      mangaId: "736a2bf0-f875-4b52-a7b4-e8c40505b68a",
      authorId: "16b98239-6452-4859-b6df-fdb1c7f12b52",
    },
    {
      img: "opm",
      title: "One Punch Man",
      mangaId: "d8a959f7-648e-4c8d-8f23-f1f3f8e129f3",
      authorId: "16b98239-6452-4859-b6df-fdb1c7f12b52",
    },
    {
      img: "jjk",
      title: "jujutsu kaisen",
      mangaId: "c52b2ce3-7f95-469c-96b0-479524fb7a1a",
      authorId: "94be1d47-54d0-42c6-b42b-439605e3793f",
    },
    {
      img: "csm",
      title: "Chainsaw Man",
      mangaId: "a77742b1-befd-49a4-bff5-1ad4e6b0ef7b",
      authorId: "f85a5b93-3c87-4c61-9032-07ceacbb9e64",
    },
  ];

  const mangaQueries = useQueries({
    queries: caseManga.map((val) => {
      const { mangaId } = val;
      return {
        queryKey: ["manga-cover", { mangaId }],
        queryFn: () => axiosInstance.get(`/api/v1/manga/cover/${mangaId}`),
      };
    }),
  });

  return (
    <section className="mangas | container">
      <Link to="/read">
        <div className="mangas__back">
          <svg
            className="mangas__arrow-svg"
            viewBox="0 0 512 512"
            fill="currentColor"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={48}
              d="M244 400L100 256l144-144M120 256h292"
            />
          </svg>
          <span className="mangas__span-text">Read</span>
        </div>
      </Link>
      <div className="mangas__content">
        <h2 className="mangas__title">Read The Hit Manga Series!</h2>
        <div className="mangas__container">
          {caseManga?.map((val, idx) => {
            return (
              <MangaCard
                key={idx}
                img={mangaQueries[idx]?.data?.data?.coverImgUrl}
                title={val.title}
                mangaId={val.mangaId}
                authorId={val.authorId}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Mangas;
