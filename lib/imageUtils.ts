export async function getProductImage(productName: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(productName)}&per_page=1`,
      {
        headers: {
          'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    
    // Fallback image if no results found
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
  } catch (error) {
    console.error('Error fetching product image:', error);
    // Return a fallback image on error
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30';
  }
}
