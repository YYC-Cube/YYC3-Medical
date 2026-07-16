import { ErrorTester } from '@/components/dev/error-tester';

export const metadata = {
  title: '错误测试',
  description: '测试系统错误处理机制',
};

export default function ErrorTestPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">错误处理测试工具</h1>
      <ErrorTester />
    </div>
  );
}
