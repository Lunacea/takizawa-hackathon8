import { Table, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="m-8">
      <div className="flex items-center justify-between p-4">
        <div>
          <h1 className="text-4xl font-bold p-4">学祭のポスター作って！</h1>
          <h2 className="text-2xl font-bold p-4">年/月/日（曜日）時間</h2>
        </div>
        <button className="bg-red-400 text-white border border-gray-400 font-bold px-21 py-8 mr-28 rounded hover:bg-red-200">
          応募する
        </button>
      </div>

      <div className="flex justify-end mr-32">
        <Button
          className="px-12 py-8 bg-white text-black border border-gray-400 font-bold rounded hover:bg-gray-100"
          variant="default"
        >
          気になるリストに入れる
        </Button>
      </div>

      <img className="m-4" src="" alt="イメージ画像" />
      <p className="m-4">画像の一言説明</p>

      <Table className="border border-gray-300 w-100 m-4">
        <TableBody>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">依頼者名</TableHead>
            <TableCell>県立太郎</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">依頼者の所属</TableHead>
            <TableCell>岩手県立大学</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">住所</TableHead>
            <TableCell>岩手県滝沢市巣子152 52</TableCell>
          </TableRow>
          <TableRow className="border-b border-gray-300">
            <TableHead className="w-32 text-left">ジャンル</TableHead>
            <TableCell>デザイン</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <span className="bg-cyan-200 text-2xl m-4 p-2 inline-block">詳細</span>
      <div className="m-4">岩手県立大学の学際のパスターを作ってください！デザインに自信がない人もご参加ください！</div>
    </div>
  );
}
