export function extractYoutubeId(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
  
      // youtube.com/watch?v=...
      if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      }
  
      // youtu.be/...
      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.slice(1);
      }
  
      return null;
    } catch {
      return null;
    }
  }