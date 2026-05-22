import sys
import torch
import torch.nn as nn
import numpy as np
from typing import Tuple
from utils import (
    load_model,
    compute_accuracy,
    compute_recall,
    load_test_data
)

def evaluate_model(model_path: str, test_data_path: str) -> Tuple[float, float]:
    """
    加载模型并评估其在测试集上的准确率与召回率。
    参数:
        model_path: 模型文件路径
        test_data_path: 测试数据文件路径
    返回:
        (accuracy, recall)
    """
    try:
        model: nn.Module = load_model(model_path)
        test_data: Tuple[np.ndarray, np.ndarray] = load_test_data(test_data_path)
        predictions = model(test_data[0])
        accuracy = compute_accuracy(predictions, test_data[1])
        recall = compute_recall(predictions, test_data[1])
        return accuracy, recall
    except Exception as e:
        print(f"❌ 模型评估失败: {e}")
        return 0.0, 0.0

if __name__ == "__main__":
    model_path: str = sys.argv[1]
    test_data_path: str = sys.argv[2]
    acc, rec = evaluate_model(model_path, test_data_path)
    print({"accuracy": acc, "recall": rec})
