
import { scrapeNoonProduct } from './lib/scraper';

const url = 'https://www.noon.com/egypt-ar/65-inch-frameless-webos-4k-uhd-smart-qled-tv-with-built-in-receiver-black-l65hynda750/Z95D3EC8D1FDF1FA8DB76Z/p/?o=b51a8cdb3b37b9bd&shareId=667494c6-8cd7-4c80-a1c9-cca4cc1ade42';

async function test() {
    console.log('Testing scraper with URL:', url);
    try {
        const product = await scrapeNoonProduct(url);
        console.log('Scraping Result:', JSON.stringify(product, null, 2));
    } catch (error) {
        console.error('Scraping Failed:', error);
    }
}

test();
