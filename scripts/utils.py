# utils.py: 评估脚本依赖工具
import torch
import torch.nn as nn
import numpy as np
from typing import Dict, Any, Tuple
from pathlib import Path


def build_model() -> nn.Module:
    """构建一个简单的神经网络模型"""
    model = nn.Sequential(
        nn.Linear(128, 64),
        nn.ReLU(),
        nn.Linear(64, 10)
    )
    return model

def load_model(model_path: str) -> nn.Module:
    """
    加载保存的 PyTorch 模型
    """
    path = Path(model_path)
    if not path.exists():
        raise FileNotFoundError(f"模型文件不存在: {model_path}")
    model = torch.load(model_path)
    model.eval()
    return model

def load_test_data(data_path: str) -> Tuple[np.ndarray, np.ndarray]:
    """
    加载测试数据，返回 (features, labels)
    支持 .npz 或 .json 格式
    """
    import json
    path = Path(data_path)
    if not path.exists():
        raise FileNotFoundError(f"测试数据文件不存在: {data_path}")
    if data_path.endswith('.npz'):
        data = np.load(data_path)
        return data['x'], data['y']
    elif data_path.endswith('.json'):
        with open(data_path, 'r', encoding='utf-8') as f:
            raw = json.load(f)
        x = np.array(raw['x'])
        y = np.array(raw['y'])
        return x, y
    else:
        raise ValueError("仅支持 .npz 或 .json 格式的测试数据")

def load_numpy_data(file_path: str) -> np.ndarray:
    """加载 NumPy 数据文件"""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")
    return np.load(file_path)

def parse_json_data(file_path: str) -> Dict[str, Any]:
    """加载 JSON 数据并返回字典"""
    import json
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"文件不存在: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def compute_accuracy(predictions: np.ndarray, labels: np.ndarray) -> float:
    """
    计算准确率
    """
    preds = np.argmax(predictions, axis=1)
    correct = (preds == labels).sum()
    return float(correct) / len(labels)

def compute_recall(predictions: np.ndarray, labels: np.ndarray) -> float:
    """
    计算宏平均召回率（multi-class）
    """
    preds = np.argmax(predictions, axis=1)
    recall_scores = []
    classes = np.unique(labels)
    for cls in classes:
        true_positive = ((preds == cls) & (labels == cls)).sum()
        actual_positive = (labels == cls).sum()
        recall = true_positive / actual_positive if actual_positive > 0 else 0.0
        recall_scores.append(recall)
    return float(np.mean(recall_scores))
