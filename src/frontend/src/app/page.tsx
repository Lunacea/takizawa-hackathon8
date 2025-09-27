import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

type Volunteer = {
  id: number;
  title: string;
  organizer: string;
  date: string;
  place: string;
  genre: string;
  imageUrl: string;
};

const volunteers: Volunteer[] = [
  {
    id: 1,
    title: "学祭のポスター作成",
    organizer: "岩手県立大学",
    date: "2025/10/01 12:00〜14:00",
    place: "岩手県 滝沢市",
    genre: "デザイン",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 2,
    title: "地域イベントのチラシ作成",
    organizer: "盛岡市役所",
    date: "2025/10/10 14:00〜17:00",
    place: "岩手県 盛岡市",
    genre: "デザイン",
    imageUrl: "https://placehold.co/600x400",
  },
  {
    id: 3,
    title: "高齢者向けのリモート相談サポート",
    organizer: "滝沢市社会福祉協議会",
    date: "2025/10/15 13:00〜15:00",
    place: "岩手県 滝沢市",
    genre: "福祉",
    imageUrl: "https://placehold.co/600x400",
  },
];

export default function VolunteerListPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">ボランティア一覧</h1>

      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {volunteers.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            {/* 画像 */}
            <div className="relative w-full h-48">
              <Image
                src={v.imageUrl}
                alt={v.title}
                fill
                className="object-cover"
              />
            </div>

            {/* 内容 */}
            <div className="p-5">
              <h2 className="text-xl font-semibold">{v.title}</h2>
              <p className="text-sm text-gray-600 mb-2">{v.organizer}</p>
              <p className="text-sm"><Calendar /> {v.date}</p>
              <p className="text-sm"><MapPin /> {v.place}</p>
              <span className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {v.genre}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}