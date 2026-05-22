import { useLocale } from 'next-intl';
import { useState } from 'react';

export default function SearchBar() {
  const locale = useLocale();
  const [results, setResults] = useState([]);

  const handleSearch = async query => {
    const res = await fetch(`/api/search?lang=${locale}&q=${query}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <input type="text" onChange={e => handleSearch(e.target.value)} />
      <ul>
        {results.map(doc => (
          <li key={doc.title}>{doc.title}</li>
        ))}
      </ul>
    </div>
  );
}
