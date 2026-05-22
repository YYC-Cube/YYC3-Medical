// ...existing content from 混淆产物/search.ts...
import { Client } from '@elastic/elasticsearch';

const esClient = new Client({ node: 'http://localhost:9200' });

export async function searchMedicalRecords(query: string, lang: 'zh' | 'en') {
  // 根据语言选择索引
  const index = lang === 'zh' ? 'medical_records_zh' : 'medical_records_en';
  // 构建全文搜索请求
  const result = await esClient.search({
    index,
    body: {
      query: {
        multi_match: {
          query,
          fields: ['title', 'diagnosis'],
          fuzziness: 'AUTO',
        },
      },
    },
  });
  // 返回匹配的记录
  return result.hits.hits.map(hit => hit._source);
}
