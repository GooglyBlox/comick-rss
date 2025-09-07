import { ComickFollow } from "@/types/comick";
import crypto from "crypto";

export function buildFeedSignature(follows: ComickFollow[]) {
  const items = normalizeAndSort(follows).slice(0, 50);
  const newest = items[0];
  const latestDate = newest
    ? new Date(newest.md_comics.uploaded_at)
    : new Date(0);

  const signaturePayload = items.map((f) => ({
    id: f.md_comics.id,
    last_chapter: f.md_comics.last_chapter,
    uploaded_at: f.md_comics.uploaded_at,
  }));

  const etag = `"W/${crypto
    .createHash("sha1")
    .update(JSON.stringify(signaturePayload))
    .digest("hex")}"`;

  const lastModified = latestDate.toUTCString();
  return { etag, lastModified };
}

export function generateRSSFeed(
  follows: ComickFollow[],
  userId: string,
  baseUrl: string,
  lastModifiedUTC?: string
): string {
  const sortedFollows = normalizeAndSort(follows).slice(0, 50);

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
            ? `<img src="${coverImage}" alt="${escapeXml(
                comic.title
              )}" style="max-width: 200px; height: auto; margin-bottom: 10px;" />`
            : ""
        }
        <p><strong>${escapeXml(comic.title)}</strong></p>
        ${chapter ? `<p>Chapter ${escapeXml(chapter.chap)}</p>` : ""}
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
        ? { url: coverImage, type: "image/jpeg" }
        : undefined,
    };
  });

  const lastBuild = lastModifiedUTC || new Date().toUTCString();

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Comick.io Follows - Latest Updates</title>
    <description>Latest chapter updates from your followed comics on Comick.io</description>
    <link>https://comick.io/user/${userId}/list</link>
    <atom:link href="${baseUrl}/api/rss/${userId}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <ttl>5</ttl>
    <lastBuildDate>${lastBuild}</lastBuildDate>
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

function normalizeAndSort(follows: ComickFollow[]) {
  return follows
    .filter(
      (follow) =>
        follow.md_comics && follow.md_comics.uploaded_at && follow.type !== 4
    )
    .sort(
      (a, b) =>
        new Date(b.md_comics.uploaded_at).getTime() -
        new Date(a.md_comics.uploaded_at).getTime()
    );
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

function escapeXml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
