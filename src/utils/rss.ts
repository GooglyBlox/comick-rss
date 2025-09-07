/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComickFollow } from "@/types/comick";
import crypto from "crypto";

export function buildFeedSignature(follows: ComickFollow[]) {
  const items = normalizeAndSort(follows).slice(0, 50);
  const newest = items[0];
  const latestDate = newest?.md_comics?.uploaded_at
    ? new Date(newest.md_comics.uploaded_at)
    : new Date(0);

  const signaturePayload = items.map((f) => ({
    id: f?.md_comics?.id ?? "unknown",
    last_chapter: f?.md_comics?.last_chapter ?? "",
    uploaded_at: f?.md_comics?.uploaded_at ?? "",
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
    const comic = follow?.md_comics ?? ({} as any);
    const chapter = (follow as any)?.md_chapters ?? null;

    const coverImage = comic?.md_covers?.length
      ? `https://meo.comick.pictures/${comic.md_covers[0].b2key}`
      : "";

    const titleText =
      chapter && chapter.chap != null
        ? `${comic?.title ?? "Untitled"} - Chapter ${chapter.chap}`
        : `${comic?.title ?? "Untitled"}`;

    const comicTitle = escapeXml(comic?.title ?? "Untitled");
    const chapterNum = chapter?.chap != null ? escapeXml(chapter.chap) : "";
    const lastChapter =
      comic?.last_chapter != null ? escapeXml(comic.last_chapter) : "";

    const descriptionHtml = `
      <div>
        ${
          coverImage
            ? `<img src="${escapeXml(
                coverImage
              )}" alt="${comicTitle}" style="max-width: 200px; height: auto; margin-bottom: 10px;" />`
            : ""
        }
        <p><strong>${comicTitle}</strong></p>
        ${chapterNum ? `<p>Chapter ${chapterNum}</p>` : ""}
        <p>Status: ${getStatusText(Number(comic?.status ?? 0))}</p>
        <p>Last Chapter: ${lastChapter}</p>
      </div>
    `.trim();

    const link = `https://comick.io/comic/${escapeXml(comic?.slug ?? "")}`;
    const pubDate = new Date(comic?.uploaded_at ?? Date.now()).toUTCString();
    const guid = `comick-${String(comic?.id ?? "unknown")}-${String(
      comic?.last_chapter ?? "na"
    )}`;

    return {
      title: titleText,
      link,
      description: descriptionHtml,
      pubDate,
      guid,
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
    <link>https://comick.io/user/${escapeXml(userId)}/list</link>
    <atom:link href="${escapeXml(
      `${baseUrl}/api/rss/${userId}`
    )}" rel="self" type="application/rss+xml"/>
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
      <title><![CDATA[${toCData(item.title)}]]></title>
      <description><![CDATA[${toCData(item.description)}]]></description>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="false"><![CDATA[${toCData(item.guid)}]]></guid>
      <pubDate>${item.pubDate}</pubDate>
      ${
        item.enclosure
          ? `<enclosure url="${escapeXml(
              item.enclosure.url
            )}" type="${escapeXml(item.enclosure.type)}"/>`
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
  return (follows ?? [])
    .filter((f) => f?.md_comics)
    .filter((f) => f?.type !== 4)
    .sort(
      (a, b) =>
        new Date(b?.md_comics?.uploaded_at ?? 0).getTime() -
        new Date(a?.md_comics?.uploaded_at ?? 0).getTime()
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

function escapeXml(input: unknown): string {
  const s = input == null ? "" : String(input);
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toCData(input: unknown): string {
  const s = input == null ? "" : String(input);
  return s.replaceAll("]]>", "]]]]><![CDATA[>");
}
