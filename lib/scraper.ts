import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './types';

export async function scrapeNoonProduct(url: string): Promise<Omit<Product, 'created_at'>> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        const $ = cheerio.load(data);

        // 1. Try to find JSON-LD (Schema.org)
        let jsonLdData: any = null;
        $('script[type="application/ld+json"]').each((_, el) => {
            try {
                const content = $(el).html();
                if (content) {
                    const parsed = JSON.parse(content);
                    // Look for Product or array containing Product
                    if (Array.isArray(parsed)) {
                        const product = parsed.find(item => item['@type'] === 'Product');
                        if (product) jsonLdData = product;
                    } else if (parsed['@type'] === 'Product') {
                        jsonLdData = parsed;
                    }
                }
            } catch (e) {
                // ignore parse errors
            }
        });

        // Extract data with fallbacks
        let title =
            jsonLdData?.name ||
            $('meta[property="og:title"]').attr('content') ||
            $('meta[name="twitter:title"]').attr('content') ||
            $('h1').first().text().trim();

        let image =
            jsonLdData?.image?.[0] ||
            jsonLdData?.image ||
            $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            '';

        let description =
            jsonLdData?.description ||
            $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            $('[class*="description"] p').first().text() ||
            '';

        const brand =
            jsonLdData?.brand?.name ||
            $('meta[property="product:brand"]').attr('content') ||
            '';

        // Category
        let category = 'General';
        if (jsonLdData?.category) {
            category = jsonLdData.category;
        } else {
            const breadcrumb =
                $('[class*="breadcrumb"] a').last().text() ||
                $('meta[property="product:category"]').attr('content');
            if (breadcrumb) category = breadcrumb;
        }

        // Price
        let price = 0;
        let currency = 'EGP'; // Default to EGP

        if (jsonLdData?.offers?.price) {
            price = parseFloat(jsonLdData.offers.price);
            if (jsonLdData.offers.priceCurrency) currency = jsonLdData.offers.priceCurrency;
        } else {
            // Try OpenGraph price
            const ogPrice = $('meta[property="product:price:amount"]').attr('content');
            const ogCurrency = $('meta[property="product:price:currency"]').attr('content');

            if (ogPrice) {
                price = parseFloat(ogPrice);
                if (ogCurrency) currency = ogCurrency;
            } else {
                // Fallback to scraping DOM
                const priceText = $('[class*="price"]').first().text();
                const match = priceText.match(/(\d+(\.\d+)?)/);
                if (match) {
                    price = parseFloat(match[0]);
                }
            }
        }

        // Rating
        let rating = 0;
        let reviews_count = 0;
        if (jsonLdData?.aggregateRating) {
            rating = parseFloat(jsonLdData.aggregateRating.ratingValue);
            reviews_count = parseInt(jsonLdData.aggregateRating.reviewCount);
        }

        // Noon Specific Scraping
        if (url.includes('noon')) {
            // Strategy 1: Try to find Next.js data (Most reliable)
            try {
                const nextData = $('script[id="__NEXT_DATA__"]').html();
                if (nextData) {
                    const parsed = JSON.parse(nextData);
                    const productData = parsed?.props?.pageProps?.catalog?.product?.product ||
                        parsed?.props?.pageProps?.product;

                    if (productData) {
                        // Title
                        if (productData.name) title = productData.name;

                        // Description (Long description or feature bullets)
                        const longDesc = productData.long_description || productData.description;
                        const featureBullets = productData.feature_bullets;

                        if (featureBullets && Array.isArray(featureBullets) && featureBullets.length > 0) {
                            description = featureBullets.join('\n');
                        } else if (longDesc && longDesc.length > 20) {
                            // Remove HTML tags if present
                            description = longDesc.replace(/<[^>]*>/g, '\n').trim();
                        }

                        // Rating
                        if (productData.rating?.average) {
                            rating = parseFloat(productData.rating.average);
                        }
                        if (productData.rating?.count) {
                            reviews_count = parseInt(productData.rating.count);
                        }

                        // Image
                        if (productData.image_key) {
                            image = `https://f.nooncdn.com/p/${productData.image_key}.jpg?width=1200`;
                        } else if (productData.images?.image_key?.[0]) {
                            image = `https://f.nooncdn.com/p/${productData.images.image_key[0]}.jpg?width=1200`;
                        }

                        // Price
                        if (productData.price?.value) {
                            price = parseFloat(productData.price.value);
                        }
                    }
                }
            } catch (e) {
                console.log('Noon Next Data extraction failed', e);
            }

            // Strategy 2: Fallback to improved DOM scraping if Strategy 1 failed or missed data

            // Description: Avoid generic SEO text
            const isGenericDescription = (text: string) => {
                if (!text) return false;
                return text.includes('شحن مضمون') ||
                    text.includes('أفضل الأسعار') ||
                    text.includes('Fast and Free Shipping') ||
                    text.includes('نوّنها الآن') ||
                    (text.includes('تسوق') && text.includes('أونلاين'));
            };

            console.log('Current Description:', description);
            console.log('Is Generic?', isGenericDescription(description));

            // If current description is generic, wipe it out
            if (description && isGenericDescription(description)) {
                console.log('Clearing generic description');
                description = '';
            }

            if (!description || description.length < 20) {
                // Try multiple strategies to find the description
                const strategies = [
                    // Strategy 1: Look for Product Overview section
                    () => {
                        const overview = $('[class*="productOverview"]').text().trim() ||
                            $('[data-qa="product-overview"]').text().trim() ||
                            $('div:contains("Product Overview")').next().text().trim() ||
                            $('div:contains("نظرة عامة")').next().text().trim();
                        return overview;
                    },
                    // Strategy 2: Look for Key Features
                    () => {
                        const features = $('[class*="keyFeatures"] li').map((_, el) => $(el).text().trim()).get().join('\n') ||
                            $('[data-qa="key-features"] li').map((_, el) => $(el).text().trim()).get().join('\n') ||
                            $('ul li').filter((_, el) => $(el).text().length > 20).map((_, el) => $(el).text().trim()).get().slice(0, 5).join('\n');
                        return features;
                    },
                    // Strategy 3: Look for any description-like divs
                    () => {
                        return $('div[class*="sc-"] div[class*="sc-"] p').filter((_, el) => $(el).text().length > 50).first().text() ||
                            $('[data-qa="product_overview"] p').map((_, el) => $(el).text().trim()).get().join('\n') ||
                            $('.sc-9cb63f72-0 p').map((_, el) => $(el).text().trim()).get().join('\n');
                    }
                ];

                for (const strategy of strategies) {
                    try {
                        const result = strategy();
                        if (result && result.length > 20 && !isGenericDescription(result)) {
                            description = result;
                            console.log('Found description using fallback strategy');
                            break;
                        }
                    } catch (e) {
                        // Continue to next strategy
                    }
                }
            }

            // Rating Fallback
            if (rating === 0) {
                const noonRating =
                    $('div[class*="rating"] span').first().text() ||
                    $('[data-qa="product-rating-star"] span').first().text();

                if (noonRating) {
                    const match = noonRating.match(/(\d+(\.\d+)?)/);
                    if (match) {
                        rating = parseFloat(match[0]);
                    }
                }
            }
        }

        // Amazon Specific Scraping
        if (url.includes('amazon')) {
            // Title
            const amazonTitle = $('#productTitle').text().trim();
            if (amazonTitle) {
                title = amazonTitle;
            }

            // Image
            const amazonImage =
                $('#landingImage').attr('src') ||
                $('#imgBlkFront').attr('src') ||
                $('.a-dynamic-image').first().attr('src');
            if (amazonImage) {
                image = amazonImage;
            }

            // Price
            const amazonPriceText = $('.a-price .a-offscreen').first().text();
            if (amazonPriceText) {
                const match = amazonPriceText.match(/(\d+([.,]\d+)?)/);
                if (match) {
                    price = parseFloat(match[0].replace(/,/g, ''));
                }
            }

            // Description
            const bullets = $('#feature-bullets li span.a-list-item').map((_, el) => $(el).text().trim()).get().join('\n');
            if (bullets) {
                description = bullets;
            } else {
                const amazonDesc = $('#productDescription').text().trim();
                if (amazonDesc) {
                    description = amazonDesc;
                }
            }

            // Rating
            const amazonRating = $('i[class*="a-star-"] span').first().text();
            if (amazonRating) {
                const match = amazonRating.match(/(\d+(\.\d+)?)/);
                if (match) {
                    rating = parseFloat(match[0]);
                }
            }

            // Reviews
            const amazonReviews = $('#acrCustomerReviewText').first().text();
            if (amazonReviews) {
                const match = amazonReviews.match(/(\d+([.,]\d+)?)/);
                if (match) {
                    reviews_count = parseInt(match[0].replace(/,/g, ''));
                }
            }
        }

        if (!title) {
            throw new Error('Failed to scrape product title');
        }

        return {
            id: uuidv4(),
            url,
            title,
            image,
            price,
            currency,
            description,
            brand,
            category,
            rating,
            reviews_count
        };

    } catch (error) {
        console.error('Scraping error:', error);
        throw new Error('Failed to scrape product data');
    }
}
