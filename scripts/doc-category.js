// 分类标签解析与前端分类展示示例
const fs = require('fs');
const matter = require('gray-matter');

const categories = ['诊断指南', '研究报告', '操作手册'];
const docs = fs
  .readdirSync('./docs')
  .filter(f => f.endsWith('.md'))
  .map(file => {
    const { data } = matter(fs.readFileSync(`./docs/${file}`, 'utf8'));
    return { title: data.title, category: data.category };
  });

categories.forEach(cat => {
  console.log(`\n${cat}`);
  docs
    .filter(d => d.category === cat)
    .forEach(doc => {
      console.log(`- ${doc.title}`);
    });
});
