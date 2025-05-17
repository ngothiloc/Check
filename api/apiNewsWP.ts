import { NewsItem } from '../types/new';
import { decodeHtmlEntities } from '../utils/htmlDecoder';

export const fetchNewsFromWordPress = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch(
      "https://etv.org.vn/wp-json/wp/v2/posts?per_page=50"
    );
    const posts = await response.json();

    // Get images for each post
    const newsWithImages = await Promise.all(
      posts.map(async (post: any) => {
        let imageUrl = "https://via.placeholder.com/150"; // Default image if none exists

        if (post.featured_media) {
          try {
            const mediaResponse = await fetch(
              `https://etv.org.vn/wp-json/wp/v2/media/${post.featured_media}`
            );
            const mediaData = await mediaResponse.json();
            imageUrl = mediaData.source_url || imageUrl;
          } catch (error) {
            console.error("Error loading image:", error);
          }
        }

        return {
          id: post.id,
          title: decodeHtmlEntities(post.title.rendered),
          date: new Date(post.date).toLocaleDateString(),
          excerpt: decodeHtmlEntities(
            post.excerpt.rendered
              .replace(/<\/?[^>]+(>|$)/g, "")
              .substring(0, 120) + "..."
          ),
          content: decodeHtmlEntities(post.content.rendered),
          image: imageUrl,
        };
      })
    );

    return newsWithImages;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}; 