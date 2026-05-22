// ...existing content from 混淆产物/SearchBar.tsx...import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const locale = useLocale();

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q) {
      setResults([]);
      return;
    }
    const res = await fetch(`/api/search?lang=${locale}&q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.results || []);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder="请输入关键词..."
      />
      <ul>
        {results.map((item, idx) => (
          <li key={idx}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
