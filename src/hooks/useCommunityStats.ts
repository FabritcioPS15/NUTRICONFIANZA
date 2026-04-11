import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

export function useCommunityStats(userId: string | null) {
  const [stats, setStats] = useState({
    likesGiven: 0,
    postsCreated: 0,
    postsSaved: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchCommunityStats = async () => {
      try {
        // Fetch posts created by user
        const { data: userPosts, error: postsError } = await supabase
          .from('posts')
          .select('id')
          .eq('user_id', userId);

        if (postsError) throw postsError;

        // Fetch likes given by user from post_likes table
        const { data: userLikes, error: likesError } = await supabase
          .from('post_likes')
          .select('id')
          .eq('user_id', userId);

        if (likesError) throw likesError;

        // Fetch saved posts from saved_posts table
        const { data: savedPosts, error: savedError } = await supabase
          .from('saved_posts')
          .select('id')
          .eq('user_id', userId);

        if (savedError) throw savedError;
        
        setStats({
          likesGiven: userLikes?.length || 0,
          postsCreated: userPosts?.length || 0,
          postsSaved: savedPosts?.length || 0
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityStats();
  }, [userId]);

  return { stats, loading };
}
