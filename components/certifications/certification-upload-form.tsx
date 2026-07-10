'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, FileText, Trash2, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  ocrResult?: {
    name: string;
    licenseNumber: string;
    issueDate: string;
    expiryDate: string;
    issuingAuthority: string;
  };
}

interface CertificationUploadFormProps {
  stepId: string;
  onProgressUpdate: (progress: number) => void;
}

export function CertificationUploadForm({
  stepId,
  onProgressUpdate,
}: CertificationUploadFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  async function simulateUpload(fileId: string) {
    // 模拟上传进度
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(progress);
    }

    // 更新文件状态为处理中
    setUploadedFiles(prev =>
      prev.map(file => (file.id === fileId ? { ...file, status: 'processing' } : file))
    );

    // 模拟OCR处理
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 模拟OCR结果
    const mockOcrResult = {
      name: '张医生',
      licenseNumber: '110101199001011234',
      issueDate: '2020-06-15',
      expiryDate: '2025-06-15',
      issuingAuthority: '北京市卫生健康委员会',
    };

    setUploadedFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, status: 'completed', ocrResult: mockOcrResult } : file
      )
    );

    // 更新整体进度
    const completedFiles = uploadedFiles.filter(f => f.status === 'completed').length + 1;
    const totalFiles = uploadedFiles.length;
    const newProgress = Math.round((completedFiles / totalFiles) * 100);
    onProgressUpdate(newProgress);
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        status: 'uploading',
      };

      setUploadedFiles(prev => [...prev, newFile]);

      // 模拟上传过程
      simulateUpload(fileId);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 text-primary animate-pulse" />;
      case 'processing':
        return (
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        );
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'processing':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'completed':
        return 'bg-success/10 text-success border-success/30';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* 上传区域 */}
      <Card className="border-primary/30">
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-primary/50 hover:border-primary hover:bg-primary/10'
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {isDragActive ? '放开以上传文件' : '上传证书文件'}
            </h3>
            <p className="text-muted-foreground mb-4">拖拽文件到此处，或点击选择文件</p>
            <div className="text-sm text-muted-foreground">
              <p>支持格式：JPG、PNG、PDF</p>
              <p>文件大小：最大 10MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 上传进度 */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">上传中...</span>
                  <span className="text-primary">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 bg-primary/10" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 已上传文件列表 */}
      {uploadedFiles.length > 0 && (
        <Card className="border-primary/30">
          <CardContent className="p-4">
            <h4 className="font-medium text-foreground mb-4">已上传文件</h4>
            <div className="space-y-4">
              {uploadedFiles.map(file => (
                <div key={file.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(file.status)}
                      <div>
                        <h5 className="font-medium text-foreground">{file.name}</h5>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(file.status)}>
                        {file.status === 'uploading' && '上传中'}
                        {file.status === 'processing' && '识别中'}
                        {file.status === 'completed' && '已完成'}
                        {file.status === 'failed' && '失败'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* OCR识别结果 */}
                  {file.ocrResult && (
                    <div className="bg-success/10 border border-success/30 rounded-lg p-3 mt-3">
                      <h6 className="font-medium text-success mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        识别结果
                      </h6>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <Label className="text-success/80">姓名</Label>
                          <Input
                            value={file.ocrResult.name}
                            className="mt-1 border-success/30 bg-background"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label className="text-success/80">证书编号</Label>
                          <Input
                            value={file.ocrResult.licenseNumber}
                            className="mt-1 border-success/30 bg-background"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label className="text-success/80">发证日期</Label>
                          <Input
                            value={file.ocrResult.issueDate}
                            className="mt-1 border-success/30 bg-background"
                            readOnly
                          />
                        </div>
                        <div>
                          <Label className="text-success/80">有效期至</Label>
                          <Input
                            value={file.ocrResult.expiryDate}
                            className="mt-1 border-success/30 bg-background"
                            readOnly
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-success/80">发证机关</Label>
                          <Input
                            value={file.ocrResult.issuingAuthority}
                            className="mt-1 border-success/30 bg-background"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        <Button size="sm" className="bg-success hover:bg-success/80 text-primary-foreground">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          确认信息
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 上传要求说明 */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <h4 className="font-medium text-foreground mb-2">上传要求</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 请确保证书照片清晰，文字可读</li>
            <li>• 避免反光、阴影或模糊</li>
            <li>• 支持多个文件同时上传</li>
            <li>• 系统将自动识别证书信息</li>
            <li>• 如识别有误，请手动修正</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
