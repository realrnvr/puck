import Newsletter from "../models/newsletter.js";
import { fetchMangaUpdates } from "../utils/fetchMangaUpdates.js";
import { mailer } from "./mailer.js";

const createNewsletterContent = (mangaUpdate) => {
  if (!mangaUpdate) {
    return "<h1>No updates available</h1>";
  }

  const { title, chapter, publishAt, pages, link } = mangaUpdate;
  let content = "<h1>Weekly Manga Newsletter</h1>";
  content += `<p>Check out the latest chapter of <a href="${link}">${title}</a> - Chapter ${chapter} is now available!</p>`;
  content += `<p><strong>Publish Date:</strong> ${new Date(
    publishAt
  ).toLocaleDateString()}</p>`;
  content += `<p><strong>Pages:</strong> ${pages}</p>`;
  content += `<p><a href="${link}">Read it now</a></p>`;
  return content;
};

export const sendNewsLetter = async () => {
  try {
    const mangaUpdate = await fetchMangaUpdates();
    const newsletterContent = createNewsletterContent(mangaUpdate);
    const subscribers = await Newsletter.find({ isSubscribed: true });

    for (const subscriber of subscribers) {
      mailer({
        to: subscriber.email,
        subject: "Your Weekly Manga Update",
        html: newsletterContent,
      });
      console.log(`newsletter sent to: ${subscriber.email}`);
    }

    console.log("All newsletters sent successfully.");
  } catch (error) {
    console.log("error sending newsletter", error);
  }
};
