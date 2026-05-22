import { useEffect, useState } from 'react';

export default function ModelReport() {
  const [report, setReport] = useState('');

  useEffect(() => {
    fetch('/api/model-report')
      .then(res => res.json())
      .then(data => setReport(data.summary));
  }, []);

  return <pre>{report}</pre>;
}
