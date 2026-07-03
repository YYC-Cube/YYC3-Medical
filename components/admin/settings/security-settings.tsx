"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export function SecuritySettings() {
  const [passwordMinLength, setPasswordMinLength] = useState(8)
  const [passwordComplexity, setPasswordComplexity] = useState("medium")
  const [passwordExpiry, setPasswordExpiry] = useState(90)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5)
  const [lockoutDuration, setLockoutDuration] = useState(30)
  const [sessionTimeout, setSessionTimeout] = useState(60)
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>安全设置</CardTitle>
        <CardDescription>管理系统安全策略和访问控制</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>密码最小长度</Label>
          <Input
            type="number"
            value={passwordMinLength}
            onChange={(e) => setPasswordMinLength(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>密码复杂度</Label>
          <Select value={passwordComplexity} onValueChange={setPasswordComplexity}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">低</SelectItem>
              <SelectItem value="medium">中</SelectItem>
              <SelectItem value="high">高</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>密码过期天数</Label>
          <Input
            type="number"
            value={passwordExpiry}
            onChange={(e) => setPasswordExpiry(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>最大登录尝试次数</Label>
          <Input
            type="number"
            value={maxLoginAttempts}
            onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>锁定持续时间（分钟）</Label>
          <Input
            type="number"
            value={lockoutDuration}
            onChange={(e) => setLockoutDuration(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>会话超时（分钟）</Label>
          <Input
            type="number"
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>双因素认证</Label>
          <Switch checked={twoFactorAuthEnabled} onCheckedChange={setTwoFactorAuthEnabled} />
        </div>
        <Button>保存设置</Button>
      </CardContent>
    </Card>
  )
}
