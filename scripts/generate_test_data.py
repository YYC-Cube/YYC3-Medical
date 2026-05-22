import numpy as np

x = np.random.rand(100, 128).astype(np.float32)  # 100 条样本，128 维特征
y = np.random.randint(0, 10, size=(100,))        # 10 类标签

np.savez('test_data.npz', x=x, y=y)
print("✅ 测试数据已生成: test_data.npz")
