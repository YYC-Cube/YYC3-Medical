// 权限感知搜索示例
const fs = require('fs');
const matter = require('gray-matter');

function canAccess(userRole, docRole) {
  const hierarchy = ['guest', 'patient', 'nurse', 'doctor', 'admin'];
  return hierarchy.indexOf(userRole) >= hierarchy.indexOf(docRole);
}

function searchDocuments(query, userRole) {
  const docs = fs
    .readdirSync('./docs')
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const { data, content } = matter(fs.readFileSync(`./docs/${file}`, 'utf8'));
      return { title: data.title, role: data.role, content };
    });
  return docs.filter(doc => doc.content.includes(query) && canAccess(userRole, doc.role));
}

// 示例调用
const results = searchDocuments('结节', 'doctor');
results.forEach(doc => console.log(doc.title));
