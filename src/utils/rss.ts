import { ComickFollow } from "@/types/comick";

export function generateRSSFeed(
  follows: ComickFollow[],
  userId: string,
  baseUrl: string
): string {
  const sortedFollows = follows
    .filter(
      (follow) =>
        follow.md_comics && follow.md_comics.uploaded_at && follow.type !== 4
    )
    .sort(
      (a, b) =>
        new Date(b.md_comics.uploaded_at).getTime() -
        new Date(a.md_comics.uploaded_at).getTime()
    )
    .slice(0, 50);

  const rssItems = sortedFollows.map((follow) => {
    const comic = follow.md_comics;
    const chapter = follow.md_chapters;
    const coverImage =
      comic.md_covers && comic.md_covers.length > 0
        ? `https://meo.comick.pictures/${comic.md_covers[0].b2key}`
        : "";

    const title = chapter
      ? `${comic.title} - Chapter ${chapter.chap}`
      : comic.title;

    const description = `
      <div>
        ${
          coverImage
            ? `<img src="${coverImage}" alt="${comic.title}" style="max-width: 200px; height: auto; margin-bottom: 10px;" />`
            : ""
        }
        <p><strong>${comic.title}</strong></p>
        ${chapter ? `<p>Chapter ${chapter.chap}</p>` : ""}
        <p>Status: ${getStatusText(comic.status)}</p>
        <p>Last Chapter: ${comic.last_chapter}</p>
      </div>
    `.trim();

    return {
      title,
      link: `https://comick.io/comic/${comic.slug}`,
      description,
      pubDate: new Date(comic.uploaded_at).toUTCString(),
      guid: `comick-${comic.id}-${comic.last_chapter}`,
      enclosure: coverImage
        ? {
            url: coverImage,
            type: "image/jpeg",
          }
        : undefined,
    };
  });

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Comick.io Follows - Latest Updates</title>
    <description>Latest chapter updates from your followed comics on Comick.io</description>
    <link>https://comick.io/user/${userId}/list</link>
    <atom:link href="${baseUrl}/api/rss/${userId}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Comick RSS Generator</generator>
    <image>
      <title>Comick.io</title>
      <url>https://comick.io/favicon.ico</url>
      <link>https://comick.io</link>
    </image>
${rssItems
  .map(
    (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${
        item.enclosure
          ? `<enclosure url="${item.enclosure.url}" type="${item.enclosure.type}"/>`
          : ""
      }
    </item>`
  )
  .join("")}
  </channel>
</rss>`;

  return rssXml;
}

function getStatusText(status: number): string {
  switch (status) {
    case 1:
      return "Ongoing";
    case 2:
      return "Completed";
    case 3:
      return "Hiatus";
    case 4:
      return "Cancelled";
    default:
      return "Unknown";
  }
}
