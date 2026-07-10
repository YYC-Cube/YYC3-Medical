import { useState } from 'react';

interface SearchDoc {
  title: string;
}

export default function SearchBar() {
  const [results, setResults] = useState<SearchDoc[]>([]);

  const handleSearch = async (query: string) => {
    // STATIC-EXPORT-NOTE: /api/search 不存在于静态导出，这里保留接口契约。
    setResults([]);
  };

  return (
    <div>
      <input type="text" onChange={e => handleSearch(e.target.value)} />
      <ul>
        {results.map((doc: SearchDoc) => (
          <li key={doc.title}>{doc.title}</li>
        ))}
      </ul>
    </div>
  );
}
