// 文档导出 PDF/HTML 示例
const fs = require('fs');
const matter = require('gray-matter');
const marked = require('marked');

const file = 'docs/diagnosis.md';
const { data, content } = matter(fs.readFileSync(file, 'utf8'));
const header = `权限：仅 ${data.role} 可访问\n\n`;
const fullContent = header + content;
fs.writeFileSync('temp.md', fullContent);

// PDF 导出命令（需手动执行）
console.log('请运行: npx markdown-pdf temp.md -o exports/diagnosis.pdf');

// HTML 导出
const html = `
<html>
  <head><title>${data.title}</title></head>
  <body>
    <p><strong>权限：</strong>仅 ${data.role} 可访问</p>
    ${marked(content)}
  </body>
</html>
`;
fs.writeFileSync('exports/diagnosis.html', html);
console.log('已生成: exports/diagnosis.html');
