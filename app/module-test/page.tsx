import { ModuleTester } from '@/components/testing/module-tester';

export const metadata = {
  title: '模块测试',
  description: '逐一测试各个医疗功能模块的运行状态',
};

export default function ModuleTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ModuleTester />
    </div>
  );
}
