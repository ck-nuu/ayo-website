const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'enclosure'],
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml'
  }
});

async function testFetch() {
  try {
    const feed = await parser.parseURL('https://ayomidnight.substack.com/feed');
    console.log(`Title: ${feed.title}`);
    feed.items.slice(0, 2).forEach(item => {
      console.log(`- ${item.title}`);
      console.log(`  Link: ${item.link}`);
      console.log(`  Date: ${item.pubDate}`);
    });
  } catch (error) {
    console.error('Error fetching:');
    console.error(error);
  }
}

testFetch();
