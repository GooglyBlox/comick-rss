export interface ComickFollow {
  created_at: string;
  read_at: string | null;
  type: number;
  score: number | null;
  chapter_id: number | null;
  last_chapter_id: number | null;
  md_chapters: {
    hid: string;
    chap: string;
    lang: string;
    vol: string | null;
  } | null;
  md_comics: {
    id: number;
    title: string;
    slug: string;
    bayesian_rating: string | null;
    status: number;
    rating_count: number;
    follow_count: number;
    last_chapter: number;
    uploaded_at: string;
    demographic: number | null;
    country: string;
    genres: number[];
    is_english_title: boolean | null;
    md_titles: Array<{
      title: string;
      lang: string;
    }>;
    translation_completed: boolean | null;
    year: number;
    md_covers: Array<{
      w: number;
      h: number;
      b2key: string;
    }>;
  };
}

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  enclosure?: {
    url: string;
    type: string;
  };
}
