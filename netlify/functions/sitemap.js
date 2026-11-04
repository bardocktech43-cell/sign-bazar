exports.handler = async function(event, context) {
    const CLOUD_NAME = "dgugrfacv";
    const BASE_URL = "https://superstoreindia.netlify.app/";

    try {
        const response = await fetch(`https://res.cloudinary.com/${CLOUD_NAME}/image/list/smart_product.json`);
        const data = await response.json();

        let urls = `
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>`;

        if (data.resources && data.resources.length > 0) {
            data.resources.forEach(item => {
                const ctx = item.context?.custom || {};
                const name = ctx.n || "SuperStoreIndia Product";
                const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.public_id}.${item.format}`;

                urls += `
  <url>
    <loc>${BASE_URL}</loc>
    <image:image>
      <image:loc>${imageUrl}</image:loc>
      <image:title><![CDATA[${name}]]></image:title>
    </image:image>
  </url>`;
            });
        }

        const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/xml'
            },
            body: sitemapXML
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: "Error generating sitemap"
        };
    }
};
      
