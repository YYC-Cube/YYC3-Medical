export default function ModelUploadResult({ result }) {
  if (!result) return null;
  return (
    <div>
      <p>模型评估完成：</p>
      <ul>
        <li>准确率：{result.accuracy}</li>
        <li>召回率：{result.recall}</li>
      </ul>
    </div>
  );
}
