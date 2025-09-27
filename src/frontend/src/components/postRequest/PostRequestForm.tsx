import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function PostRequestForm(
  {
    author,
  }: {
    author: string;
  }
) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>新しいプロジェクトを作成</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-4 py-4">
            <Label>プロジェクト名</Label>
            <Input type="text" />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>プロジェクトカテゴリ</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">カテゴリ1</SelectItem>
                <SelectItem value="2">カテゴリ2</SelectItem>
                <SelectItem value="3">カテゴリ3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>プロジェクト概要</Label>
            <Textarea />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>プロジェクト詳細</Label>
            <Textarea />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>依頼したいこと</Label>
            <Textarea />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>希望期限</Label>
            <Input type="date" />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>希望人数</Label>
            <Input type="number" />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>参加報酬</Label>
            <Input type="number" />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>ボーナス報酬</Label>
            <Input type="number" />
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label>ボーナス報酬条件</Label>
            <Textarea />
          </div>
        </form>
        <Button type="button" variant="outline">下書き保存</Button>
        <Button type="submit">プロジェクト作成</Button>
      </CardContent>
    </Card>
  );
}
