import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEmbedUrl(url: string) {
  if (!url) return '';

  // YouTube
  // Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&showinfo=0`;
  }

  // TikTok
  // Supports: tiktok.com/@user/video/ID, tiktok.com/v/ID, tiktok.com/embed/v2/ID
  const tiktokMatch = url.match(/tiktok\.com\/(?:.*\/video\/|v\/|embed(?:\/v2)?\/)(\d+)/);
  if (tiktokMatch && tiktokMatch[1]) {
    return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}?is_from_webapp=v1&is_copy_url=0`;
  }

  // Handle TikTok short links (e.g. vm.tiktok.com or vt.tiktok.com)
  if (url.includes('tiktok.com/t/') || url.includes('vm.tiktok.com') || url.includes('vt.tiktok.com')) {
    return 'TIKTOK_SHORT_LINK';
  }

  // Google Drive
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^\/?&"'>]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }

  return url;
}

export function isEmbeddable(url: string) {
  if (!url) return false;
  
  // We check if the URL is from a known provider AND we can actually get an embed URL for it
  const isFromProvider = (
    url.includes('youtube.com') || 
    url.includes('youtu.be') || 
    url.includes('tiktok.com') || 
    url.includes('drive.google.com')
  );

  if (!isFromProvider) return false;

  const embedUrl = getEmbedUrl(url);
  
  // If the embedUrl is the same as the original URL, it means our regex didn't find a video ID.
  // In that case, we shouldn't try to embed it in an iframe.
  // Also check if the resulting embedUrl is just the base domain which would cause CSP errors.
  return embedUrl !== url && !embedUrl.endsWith('tiktok.com') && !embedUrl.endsWith('tiktok.com/');
}

export function resolveMediaUrl(url: string) {
  if (!url) return '';
  
  // If it's a full URL, check if it uses a placeholder domain like 'ej'
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If it looks like https://ej/... it's likely a malformed path or placeholder
    if (url.includes('://ej/') || url.includes('://ej.')) {
      const path = url.split('://ej')[1];
      return path.startsWith('/') ? path : `/${path}`;
    }
    return url;
  }

  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }

  // Handle protocol-relative URLs (e.g., //youtube.com/...)
  if (url.startsWith('//')) {
    const afterSlash = url.substring(2);
    // If it starts with //ej/ treat it as a root path /ej/
    if (afterSlash.startsWith('ej/')) {
      return `/${afterSlash}`;
    }
    return `https:${url}`;
  }

  // If it's a relative path, ensure it starts with / to be relative to root
  if (!url.startsWith('/')) {
    return `/${url}`;
  }

  return url;
}
