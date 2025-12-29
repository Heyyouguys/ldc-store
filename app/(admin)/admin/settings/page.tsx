import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, Globe, CreditCard, Bell, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          系统设置
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          配置网站基本信息和支付参数
        </p>
      </div>

      <div className="grid gap-6">
        {/* Site Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-5 w-5" />
              网站设置
            </CardTitle>
            <CardDescription>
              配置网站基本信息，用于前台展示和 SEO
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">网站名称</Label>
                <Input id="siteName" placeholder="LDC Store" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteUrl">网站地址</Label>
                <Input id="siteUrl" placeholder="https://store.example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">网站描述</Label>
              <Textarea
                id="siteDescription"
                placeholder="网站描述，用于 SEO"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteKeywords">SEO 关键词</Label>
              <Input
                id="siteKeywords"
                placeholder="关键词1, 关键词2, 关键词3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5" />
              支付设置
            </CardTitle>
            <CardDescription>
              配置 Linux DO Credit 支付参数
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <p>
                ⚠️ 支付密钥应通过环境变量配置，请勿在此处填写敏感信息。
              </p>
              <p className="mt-1 text-xs">
                在 .env 文件中设置 LDC_PID 和 LDC_SECRET
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>支付网关地址</Label>
                <Input
                  value="https://credit.linux.do/epay"
                  disabled
                  className="bg-zinc-100"
                />
              </div>
              <div className="space-y-2">
                <Label>订单过期时间（分钟）</Label>
                <Input type="number" placeholder="30" defaultValue={30} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Announcement Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-5 w-5" />
              公告设置
            </CardTitle>
            <CardDescription>
              配置首页显示的公告信息
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="announcementTitle">公告标题</Label>
              <Input id="announcementTitle" placeholder="系统公告" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="announcementContent">公告内容</Label>
              <Textarea
                id="announcementContent"
                placeholder="输入公告内容..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            保存设置
          </Button>
        </div>
      </div>
    </div>
  );
}

