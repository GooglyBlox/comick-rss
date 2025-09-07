import { NextRequest, NextResponse } from "next/server";
import { ComickFollow } from "@/types/comick";
import { generateRSSFeed, buildFeedSignature } from "@/utils/rss";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get("preview") === "true";

    if (!userId || !/^[a-f0-9-]+$/i.test(userId)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const apiUrl = `https://api.comick.io/user/${userId}/follows`;

    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Comick RSS Generator/1.1" },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "User not found or no follows available" },
          { status: 404 }
        );
      }
      throw new Error(`API responded with status: ${response.status}`);
    }

    const follows: ComickFollow[] = await response.json();
    if (!Array.isArray(follows) || follows.length === 0) {
      return NextResponse.json(
        { error: "No follows found for this user" },
        { status: 404 }
      );
    }

    const { etag, lastModified } = buildFeedSignature(follows);

    const reqETag = request.headers.get("if-none-match");
    const reqIMS = request.headers.get("if-modified-since");

    if (reqETag && reqETag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Last-Modified": lastModified,
          "Cache-Control":
            "public, s-maxage=300, max-age=300, stale-while-revalidate=60, stale-if-error=3600",
        },
      });
    }

    if (reqIMS) {
      const imsDate = new Date(reqIMS);
      const lmDate = new Date(lastModified);
      if (!isNaN(imsDate.getTime()) && lmDate <= imsDate) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            ETag: etag,
            "Last-Modified": lastModified,
            "Cache-Control":
              "public, s-maxage=300, max-age=300, stale-while-revalidate=60, stale-if-error=3600",
          },
        });
      }
    }

    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const rssXml = generateRSSFeed(follows, userId, baseUrl, lastModified);

    if (isPreview) {
      return new NextResponse(
        `<html>
          <head>
            <title>RSS Feed Preview</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #e5e5e5; }
              pre { background: #2d2d2d; padding: 15px; border-radius: 5px; overflow-x: auto; }
              .header { margin-bottom: 20px; }
              .back-link { color: #60a5fa; text-decoration: none; }
              .back-link:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="header">
              <a href="/" class="back-link">Back to Generator</a>
              <h1>RSS Feed Preview</h1>
              <p>This is how your RSS feed looks in XML format:</p>
            </div>
            <pre>${rssXml.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
          </body>
        </html>`,
        {
          status: 200,
          headers: {
            "Content-Type": "text/html",
            ETag: etag,
            "Last-Modified": lastModified,
            "Cache-Control":
              "public, s-maxage=300, max-age=300, stale-while-revalidate=60, stale-if-error=3600",
          },
        }
      );
    }

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        ETag: etag,
        "Last-Modified": lastModified,
        "Cache-Control":
          "public, s-maxage=300, max-age=300, stale-while-revalidate=60, stale-if-error=3600",
        Vary: "Accept-Encoding",
      },
    });
  } catch (error) {
    console.error("RSS generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate RSS feed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
