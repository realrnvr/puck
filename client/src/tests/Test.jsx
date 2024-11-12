import { useEffect, useRef, useState } from "react";
import axios from "axios";

const mangaRender = ({ baseUrl, hash, imageName, idx }) => {
  return (
    <img
      key={idx}
      src={`${baseUrl}/data/${hash}/${imageName}`}
      alt="Chapter Image"
    />
  );
};

const berserkMangaId = "801513ba-a712-498c-8f57-cae55b38cc92"; // Replace with your manga ID
const baseUrl = "https://api.mangadex.org";

const Read = () => {
  const [chapters, setChapters] = useState([]);
  const [berserk, setBerserk] = useState([]); // Holds images for a selected chapter
  const baseUrlRef = useRef(""); // To store base URL for images
  const hashRef = useRef(""); // To store hash for image path
  const [page, setPage] = useState(1); // For page number
  const [totalChapters, setTotalChapters] = useState(0); // Total chapters
  const limit = 10; // Number of chapters per page

  // Fetch chapters from MangaDex based on the page
  const fetchChapters = async (currentPage) => {
    try {
      const response = await axios.get(
        `${baseUrl}/manga/${berserkMangaId}/feed`,
        {
          params: {
            limit,
            offset: (currentPage - 1) * limit, // Calculate offset based on page
            translatedLanguage: ["en"], // Adjust language as needed
            order: { chapter: "asc" }, // Order by chapter number
          },
        }
      );
      setChapters(response.data.data);
      setTotalChapters(response.data.total); // Set total chapters
    } catch (error) {
      console.error("Failed to fetch chapters:", error);
    }
  };

  // Fetch images for a specific chapter
  const chapterImgs = async (id) => {
    try {
      const response = await axios.get(
        `https://api.mangadex.org/at-home/server/${id}`
      );
      const {
        baseUrl,
        chapter: { hash, data },
      } = response.data;
      baseUrlRef.current = baseUrl;
      hashRef.current = hash;
      setBerserk(data); // Set the images for the selected chapter
    } catch (error) {
      console.log("Error fetching chapter images:", error);
    }
  };

  // Load chapters when page changes
  useEffect(() => {
    fetchChapters(page);
  }, [page]);

  const totalPages = Math.ceil(totalChapters / limit); // Calculate total pages

  // Handle Next and Previous buttons
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <h2>Chapters</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Display chapters list */}
        {chapters.map((chapter, idx) => (
          <p
            key={idx}
            onClick={() => chapterImgs(chapter.id)} // Fetch images when clicked
            style={{
              cursor: "pointer",
              border: "1px solid red",
              padding: "0.5rem",
            }}
          >
            {chapter.attributes.title ||
              `Chapter ${chapter.attributes.chapter}`}
          </p>
        ))}
      </div>

      <div>
        {/* Pagination Controls */}
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>

      {/* Render Chapter Images */}
      <div>
        {berserk.length === 0 ? (
          <p>Select a chapter to read.</p>
        ) : (
          berserk.map((val, idx) => {
            return mangaRender({
              baseUrl: baseUrlRef.current,
              hash: hashRef.current,
              imageName: val,
              idx,
            });
          })
        )}
      </div>
    </div>
  );
};

export default Read;
