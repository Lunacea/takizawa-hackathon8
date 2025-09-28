import { Table, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import CommentSection from "../../components/Comment/CommentSection.jsx";

export default function Home() {
  return (
    <div className="m-8 space-y-8">
      {/* タイトル */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">学祭のポスター作って！</h1>
        <h2 className="text-2xl font-semibold text-gray-600">
          <time dateTime="2025-10-10T14:00">2025/10/10（金）14:00</time>
        </h2>

        {/* 募集状況 & ポイント */}
        <div className="flex items-center space-x-4 mt-2">
          <span className="font-semibold px-3 py-1 rounded">募集中</span>
          <span className="font-semibold px-3 py-1 rounded">ポイント: 100</span>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex space-x-4">
        <Button className="bg-red-500 text-white font-bold px-8 py-3 rounded hover:bg-red-400">応募する</Button>
        <Button className="bg-white text-black border border-gray-400 font-bold px-8 py-3 rounded hover:bg-gray-100">
          気になるリストに追加
        </Button>
      </div>

      {/* 画像 */}
      <div className="space-y-2">
        <img
          className="w-full max-w-md rounded"
          src="data:image/jpeg;base64,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"
          alt="イメージ画像"
        />
        <p className="text-sm">画像の一言説明</p>
      </div>

      {/* 募集詳細（タグっぽいもの + 活動内容） */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium px-2 py-1 rounded">デザイン</span>
          <span className="text-sm font-medium px-2 py-1 rounded">ボランティア</span>
        </div>

        <h2 className="text-2xl font-semibold mt-2">活動内容</h2>
        <p>岩手県立大学の学祭のポスターを作ってください！ デザインに自信がない人もご参加ください！</p>
      </div>

      {/* 依頼者情報テーブル */}
      <Table className="w-full border border-gray-300">
        <TableBody>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">依頼者名</TableHead>
            <TableCell>県立太郎</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">所属</TableHead>
            <TableCell>岩手県立大学</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">住所</TableHead>
            <TableCell>岩手県滝沢市巣子152 52</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* 依頼者詳細 */}
      <div className="space-y-2 p-4 border border-gray-200 rounded">
        <h2 className="text-xl font-semibold">依頼者の詳細</h2>
        <p>自己紹介:楽しく活動できる学祭を目指しています。デザイン制作にご協力ください！</p>
        <p>連絡先: xxxxx@gmail.com</p>
        <p>その他: 学祭運営チームのメンバーとして活動中</p>
      </div>

      {/* コメント欄 */}
      <div className="space-y-2">
        <CommentSection />

        {/* 作成/更新日時 */}
        <div className="space-y-1 text-gray-600 text-sm">
          <p>
            作成日時: <time dateTime="2025-09-27T10:00">2025/09/27</time>
            更新日時: <time dateTime="2025-09-27T14:00">2025/09/27</time>
          </p>
        </div>
      </div>
    </div>
  );
}
