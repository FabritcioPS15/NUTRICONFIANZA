export interface Post {
  id: string | number;
  user: string;
  time: string;
  tag: string;
  avatar: string;
  desc: string;
  img?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  comments: number;
  liked: boolean;
  saved: boolean;
}

export interface Video {
  id: string | number;
  title: string;
  category: string;
  desc: string;
  img: string;
  likes: number;
  liked: boolean;
  videoUrl?: string;
}

export interface Flyer {
  id: string | number;
  title: string;
  img: string;
  desc?: string;
  tag?: string;
  info?: string;
  featured?: boolean;
  saved: boolean;
}
