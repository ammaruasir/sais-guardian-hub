import { Shield } from "lucide-react";
import type { Letter } from "@/data/letters";

export function LetterTemplate({ letter, idForPrint }: { letter: Letter; idForPrint?: string }) {
  return (
    <div
      id={idForPrint ?? "letter-print-area"}
      dir="rtl"
      className="letter-sheet mx-auto bg-white text-[#0d1b2a] shadow-md"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 18mm",
        fontFamily: "'IBM Plex Sans Arabic', serif",
        fontSize: "13pt",
        lineHeight: 1.9,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b-4 border-double border-[#1B3A5C] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1B3A5C] text-white">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <div className="text-[15pt] font-bold text-[#1B3A5C]">
              الهيئة السعودية للخدمات الأمنية
            </div>
            <div className="text-[10pt] text-[#0E918C]">
              Saudi Authority for Industrial Security
            </div>
            <div className="text-[10pt] text-[#555]">وزارة الداخلية — Ministry of Interior</div>
          </div>
        </div>
        {letter.classified && (
          <div className="rounded border-2 border-red-700 px-3 py-1 text-[11pt] font-bold text-red-700">
            سري — Confidential
          </div>
        )}
      </div>

      {/* Reference block */}
      <div className="mt-5 grid grid-cols-3 gap-2 text-[11pt]">
        <div>
          <span className="font-bold">الرقم: </span>
          <span className="num">{letter.ref}</span>
        </div>
        <div className="text-center">
          <span className="font-bold">التاريخ: </span>
          <span className="num">{letter.hijriDate}</span>
        </div>
        <div className="text-end">
          <span className="font-bold">المرفقات: </span>
          <span className="num">{letter.attachmentsCount}</span>
        </div>
      </div>

      {/* Addressee */}
      <div className="mt-6">
        <div className="font-bold">المكرم/ {letter.addresseeAr}&nbsp;&nbsp;المحترم</div>
        <div className="mt-2">السلام عليكم ورحمة الله وبركاته،</div>
        <div className="mt-2 font-bold">
          الموضوع: <span className="font-normal">{letter.subjectAr}</span>
        </div>
      </div>

      {/* Body */}
      <div className="mt-4 text-justify leading-loose">
        <p>{letter.bodyIntroAr}</p>

        {letter.type !== "comments" && letter.items.length > 0 && (
          <ol className="mt-3 list-decimal space-y-1 ps-6">
            {letter.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ol>
        )}

        {letter.type === "comments" && letter.commentsTable && (
          <table className="mt-4 w-full border-collapse text-[11pt]">
            <thead>
              <tr className="bg-[#1B3A5C] text-white">
                <th className="border border-[#1B3A5C] p-2 text-center w-12">م</th>
                <th className="border border-[#1B3A5C] p-2 text-start">المستند</th>
                <th className="border border-[#1B3A5C] p-2 text-start">التعليق</th>
                <th className="border border-[#1B3A5C] p-2 text-center w-32">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {letter.commentsTable.map((row, i) => (
                <tr key={i}>
                  <td className="border border-[#1B3A5C] p-2 text-center num">{i + 1}</td>
                  <td className="border border-[#1B3A5C] p-2">{row.doc}</td>
                  <td className="border border-[#1B3A5C] p-2">{row.comment}</td>
                  <td className="border border-[#1B3A5C] p-2 text-center">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="mt-5">{letter.closingAr}</p>
      </div>

      {/* Closing */}
      <div className="mt-10 flex items-end justify-between">
        <div className="text-[11pt]">
          <div>وتقبلوا فائق التحية والتقدير،،،</div>
          <div className="mt-6 font-bold">{letter.signatoryAr}</div>
          <div className="text-[10pt] text-[#555]">{letter.signatoryTitleAr}</div>
        </div>
        {/* Circular seal */}
        <svg viewBox="0 0 120 120" className="h-28 w-28 opacity-80">
          <defs>
            <path
              id="circlePath"
              d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
            />
          </defs>
          <circle cx="60" cy="60" r="55" fill="none" stroke="#1B3A5C" strokeWidth="2" />
          <circle cx="60" cy="60" r="48" fill="none" stroke="#1B3A5C" strokeWidth="1" />
          <text fill="#1B3A5C" fontSize="9" fontWeight="bold">
            <textPath href="#circlePath" startOffset="0%">
              الهيئة السعودية للخدمات الأمنية • SAIS •
            </textPath>
          </text>
          <g transform="translate(60 60)">
            <path
              d="M 0,-18 L 14,-6 L 14,10 L 0,18 L -14,10 L -14,-6 Z"
              fill="none"
              stroke="#1B3A5C"
              strokeWidth="1.5"
            />
            <text textAnchor="middle" y="4" fontSize="8" fill="#1B3A5C" fontWeight="bold">
              SAIS
            </text>
          </g>
        </svg>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t-2 border-[#1B3A5C] pt-2 text-center text-[9pt] text-[#666]">
        الرياض — المملكة العربية السعودية | هاتف: 920000000 | sais.gov.sa
      </div>
    </div>
  );
}
