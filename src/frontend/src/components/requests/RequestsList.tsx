"use client";

// useStateをreactからインポート
import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import type { MapProps } from "@/components/ui/list_page/map";

const Map = dynamic(
  () => import('@/components/ui/list_page/map').then((mod) => mod.default),
  {
    loading: () => <p className="flex items-center justify-center w-full h-full">地図を読み込み中...</p>,
    ssr: false,
  }
);

type Volunteer = {
  id: number;
  title: string;
  organizer: string;
  date: string;
  place: string;
  genre: string;
  position: [number, number];
  imageUrl: string;
};

const volunteers: Volunteer[] = [
    {
    id: 1,
    title: "大学祭のポスター作成",
    organizer: "岩手県立大学 大学祭実行委員会",
    date: "2025/10/01 12:00〜14:00",
    place: "岩手県立大学",
    genre: "デザイン",
    position: [39.80283, 141.13606],
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYECSwYW-FZxuXsEQjKa0B-SSh5WAE-zKbfgzeRXrNnO39_84Q5Qwf-9-BxbOIAttTyyyNKwffJoSFaZTvC-PAIbMfjdwsFsLJHngzTrvrvCurDVNgptybnSzQqeFxAfcF4LPkwsWSjAvz/s800/school_building_campus_university.png",
  },
  {
    id: 2,
    title: "地域イベントのチラシ作成",
    organizer: "盛岡市",
    date: "2025/10/10 14:00〜17:00",
    place: "盛岡市役所",
    genre: "デザイン",
    position: [39.702092, 141.154473],
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhen4USe4jKgUs79krTLw450OUQQj86YJFQOZ-zSXBzcA7e3jVclsOou4qhc__8_z8SFL6JUhP4JuSzGKSZ5q5F_ycCg1bXXUnf1IUb5pbG1Rlg6NzMK2aMcRV4raNnEU3Fm-bkLUcSZLBa/s800/drone_illumination_sky.png",
  },
  {
    id: 3,
    title: "高齢者向けのリモート相談サポート",
    organizer: "滝沢市",
    date: "2025/10/15 13:00〜15:00",
    place: "ビッグルーフ滝沢",
    genre: "福祉",
    position: [39.733895, 141.078433],
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi6CDnOwz8FkELOHEkOV-b_JvY-yuar_Z0a1_uARbT6CNoLwhA8puYQIOK97uHIfzkFILEB-UzOeQQLTClcc6b0MkK5AOFZfn4mnXyuYTFXnPAYszVEOKx6w7ce3DCmyv5GdSjBbgYsJ4eJ/s800/pasokon_kyoushitsu_smartphone.png",
  },
  {
    id: 4,
    title: "滝沢山車まつりのイベントポスター作成",
    organizer: "巣子自治会",
    date: "2025/10/15 12:00~14:00",
    place: "巣子集会所",
    genre: "デザイン",
    position: [39.776569, 141.134145],
    imageUrl:" "
  },
  {
    id: 5,
    title: "Webサイト構築",
    organizer: "NV cafe",
    date: "2025/10/16 9:00~17:00",
    place: "NV cafe",
    genre: "IT",
    position: [39.798645, 141.142253],
    imageUrl:" "
  },
  {
    id: 6,
    title: "Webサイトシステム更新作業",
    organizer: "アポログループ",
    date: "2025/10/17 12:00~17:00",
    place: "アポロリンクスゴルフ練習場",
    genre: "IT",
    position: [39.787807, 141.144479],
    imageUrl:" "
  },
  {
    id: 7,
    title: "Webサイト構築",
    organizer: "American Cafe DENVERS",
    date: "2025/10/18 9:00~17:00",
    place: "American Cafe DENVERS",
    genre: "IT",
    position: [39.77873, 141.143332],
    imageUrl:" "
  },
  {
    id: 8,
    title: "Webサイトシステム更新作業",
    organizer: "麺や きぶし",
    date: "2025/10/18 12:00~17:00",
    place: "麺や きぶし",
    genre: "IT",
    position: [39.774978, 141.130459],
    imageUrl:" "
  },
  {
    id: 9,
    title: "クレープ屋の販促チラシ作成",
    organizer: "Cafe Wagtail",
    date: "2025/10/19 12:00~15:00",
    place: "Cafe Wagtail",
    genre: "デザイン",
    position: [39.798894, 141.149387],
    imageUrl:" "
  },
  {
    id: 10,
    title: "滝沢森林公園のSNSでの魅力発信",
    organizer: "滝沢市",
    date: "2025/10/19 14:00~17:00",
    place: "滝沢市役所",
    genre: "SNS投稿",
    position: [39.735043, 141.077846],
    imageUrl:" "
  },
  {
    id: 11,
    title: "洋食店の販促チラシ作成",
    organizer: "りもーね",
    date: "2025/10/20 12:00~16:00",
    place: "りもーね",
    genre: "デザイン",
    position: [39.799132, 141.14735],
    imageUrl:" "
  },
  {
    id: 12,
    title: "南昌荘のSNSでの魅力発信",
    organizer: "盛岡市",
    date: "2025/10/21 12:00~14:00",
    place: "盛岡観光コンベンション協会",
    genre: "SNS投稿",
    position: [39.7001, 141.154744],
    imageUrl:" "
  },
];

export default function VolunteerListPage() {
  // 表示する地図のIDを管理するためのstate (初期値はnullで地図は非表示)
  const [visibleMapId, setVisibleMapId] = useState<number | null>(null);

  // ボタンがクリックされたときに地図の表示/非表示を切り替える関数
  const handleMapToggle = (id: number) => {
    setVisibleMapId(prevId => (prevId === id ? null : id));
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">ボランティア一覧</h1>

      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
        {volunteers.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col">
            
            {/* テキスト情報 */}
            <div className="p-5 flex flex-col flex-grow">
              <span className="inline-block mb-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full self-start">{v.genre}</span>
              <h2 className="text-xl font-semibold mt-1 mb-1">{v.title}</h2>
              <p className="text-sm text-gray-600 mb-3">{v.organizer}</p>
              <div className="space-y-2 text-sm text-gray-800 mt-auto">
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4 flex-shrink-0" /> {v.date}</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="flex items-center gap-2"><MapPin className="w-4 h-4 flex-shrink-0" /> {v.place}</p>
                  <button 
                    onClick={() => handleMapToggle(v.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors whitespace-nowrap"
                  >
                    {visibleMapId === v.id ? '地図を隠す' : '場所を表示'}
                  </button>
                </div>
              </div>
            </div>

            {/* 地図 (条件付きで表示) */}
            {visibleMapId === v.id && (
              <div className="w-full h-48 border-t">
                <Map position={v.position} popupText={v.title} />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}