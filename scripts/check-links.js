const fs = require('fs');
const markdownLinkCheck = require('markdown-link-check');

const files = fs.readdirSync('./docs').filter(f => f.endsWith('.md'));

files.forEach(file => {
  const content = fs.readFileSync(`./docs/${file}`, 'utf8');
  markdownLinkCheck(content, { baseUrl: 'https://yourdomain.com' }, (err, results) => {
    if (err) {
      console.error(`Error checking ${file}:`, err);
      return;
    }
    results.forEach(link => {
      if (link.status === 'dead') {
        console.warn(`❌ Dead link in ${file}: ${link.link}`);
      }
    });
  });
});
