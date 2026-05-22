#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
from typing import Optional

def convert_typescript_to_python(ts_file: str, py_file: str) -> Optional[str]:
    """
    将 TypeScript 类型定义转换为 Python 类型定义。
    参数:
        ts_file: 输入的 TypeScript 文件路径
        py_file: 输出的 Python 文件路径
    返回:
        错误信息（如果有），否则返回 None
    """
    if not os.path.exists(ts_file):
        return f"❌ 输入文件不存在: {ts_file}"

    try:
        with open(ts_file, 'r', encoding='utf-8') as f:
            ts_content: str = f.read()

        py_lines: list[str] = []

        for line in ts_content.splitlines():
            line = line.strip()
            if not line or line.startswith('//'):
                continue

            # 简单转换 TypeScript 接口为 Python 类
            match = re.match(r'^export interface (\w+)', line)
            if match:
                class_name = match.group(1)
                py_lines.append(f"class {class_name}:")
                continue

            # 转换字段定义
            match = re.match(r'^(\w+)\??: ([\w\[\]]+);?', line)
            if match:
                field_name, ts_type = match.groups()
                py_type = ts_type.replace('string', 'str').replace('number', 'float').replace('boolean', 'bool')
                py_lines.append(f"    {field_name}: Optional[{py_type}] = None")
                continue

        # 如果没有内容，添加占位
        if not py_lines:
            py_lines.append("# 无法解析 TypeScript 文件内容")

        with open(py_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(py_lines))

        print(f"✅ 转换完成: {py_file}")
        return None

    except Exception as e:
        return f"❌ 转换失败: {str(e)}"

# 使用方式示例
if __name__ == "__main__":
    error = convert_typescript_to_python("types/User.ts", "types/user_stub.py")
    if error:
        print(error)
