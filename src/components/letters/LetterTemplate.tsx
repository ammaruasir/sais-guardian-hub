import type { Letter } from "@/data/letters";
import saisEmblem from "@/assets/sais-emblem.png";

export function LetterTemplate({ letter, idForPrint }: { letter: Letter; idForPrint?: string }) {
  return (
    <div
      id={idForPrint ?? "letter-print-area"}
      dir="rtl"
      className="letter-sheet mx-auto bg-white text-[#1a1a1a] shadow-md flex flex-col"
      style={{
        width: "210mm",
        height: "297mm",
        padding: "10mm 10mm",
        fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', serif",
        fontSize: "11pt",
        lineHeight: 1.7,
        boxSizing: "border-box",
      }}
    >
      {/* Full-page bordered container */}
      <div className="relative flex flex-col flex-1 rounded-[24px] border-2 border-[#0E5A3A] p-6">
        {/* Confidential badge */}
        {letter.classified && (
          <div className="absolute -top-3 right-10 bg-white px-3 text-[10pt] font-bold text-[#0E5A3A]">
            برقية سرية
          </div>
        )}

        {/* ===== Header inside border ===== */}
        <div className="grid grid-cols-3 items-start gap-4 pb-3 border-b border-[#0E5A3A]/30">
          {/* Right: titles */}
          <div className="text-end">
            <div className="text-[#0E5A3A] font-bold leading-tight" style={{ fontSize: "14pt" }}>
              المملكة العربية السعودية
            </div>
            <div className="text-[#0E5A3A] font-bold leading-tight mt-0.5" style={{ fontSize: "13pt" }}>
              الهيئة العليا للأمن الصناعي
            </div>
            <div className="mt-0.5 text-[9pt] text-[#0E5A3A]">(١٨٩)</div>
          </div>

          {/* Center: emblem */}
          <div className="flex flex-col items-center">
            <img src={saisEmblem} alt="SAIS" className="h-20 w-auto object-contain" />
            <div className="mt-1 text-center text-[7pt] text-[#0E5A3A] font-semibold leading-tight">
              الهيئة العليا للأمن الصناعي
              <div className="text-[6pt] text-[#0E5A3A]/70">
                Supreme Authority For Industrial Security
              </div>
            </div>
          </div>

          {/* Left: meta */}
          <div className="text-[9pt] space-y-1.5 pt-1">
            <FieldLine label="الرقم" value={letter.ref} />
            <FieldLine label="التاريخ" value={letter.hijriDate} />
            <FieldLine
              label="التوابع"
              value={letter.attachmentsCount ? String(letter.attachmentsCount) : ""}
            />
          </div>
        </div>

        {/* Addressee */}
        <div className="mt-4 text-[11pt] leading-loose">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold">سعادة </span>
              <span>{letter.addresseeAr || "____________"}</span>
            </div>
            <span className="font-bold">سلمه الله</span>
          </div>
          <div className="mt-2 font-bold">السلام عليكم ورحمة الله وبركاته،</div>
        </div>

        {/* Sections */}
        <div className="mt-3 space-y-3 text-justify flex-1">
          <LabeledBlock label="الإشارة">
            <span>
              {letter.referenceAr?.trim() ||
                `بالإشارة إلى الطلب رقم ${letter.requestId} المقدّم من ${letter.addresseeAr}.`}
            </span>
          </LabeledBlock>

          <LabeledBlock label="الموضوع">
            <span>{letter.subjectAr}</span>
          </LabeledBlock>

          <LabeledBlock label="الإفادة">
            <div>
              <p>{letter.bodyIntroAr}</p>

              {letter.type !== "comments" && letter.items.length > 0 && (
                <ol className="mt-2 list-decimal space-y-0.5 ps-6">
                  {letter.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ol>
              )}

              {letter.type === "comments" && letter.commentsTable && (
                <table className="mt-3 w-full border-collapse text-[10pt]">
                  <thead>
                    <tr className="bg-[#0E5A3A] text-white">
                      <th className="border border-[#0E5A3A] p-1.5 text-center w-10">م</th>
                      <th className="border border-[#0E5A3A] p-1.5 text-start">المستند</th>
                      <th className="border border-[#0E5A3A] p-1.5 text-start">التعليق</th>
                      <th className="border border-[#0E5A3A] p-1.5 text-center w-28">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {letter.commentsTable.map((row, i) => (
                      <tr key={i}>
                        <td className="border border-[#0E5A3A]/60 p-1.5 text-center">{i + 1}</td>
                        <td className="border border-[#0E5A3A]/60 p-1.5">{row.doc}</td>
                        <td className="border border-[#0E5A3A]/60 p-1.5">{row.comment}</td>
                        <td className="border border-[#0E5A3A]/60 p-1.5 text-center">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </LabeledBlock>

          <LabeledBlock label="المطلوب">
            <span>{letter.closingAr}</span>
          </LabeledBlock>

          <p className="pt-1">والسلام عليكم ورحمة الله وبركاته،،،</p>
        </div>

        {/* Signature */}
        <div className="mt-6 flex items-end justify-start">
          <div className="text-center">
            <div className="border-b-2 border-dotted border-[#0E5A3A]/70 px-12 pb-1 text-[10pt] font-bold text-[#0E5A3A]">
              {letter.signatoryAr}
            </div>
            <div className="mt-1 text-[9pt] text-[#444]">{letter.signatoryTitleAr}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-[#0E5A3A]/30 text-center text-[8pt] text-[#666]">
          الرياض — المملكة العربية السعودية | sais.gov.sa
        </div>
      </div>
    </div>
  );
}

function FieldLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#0E5A3A] font-bold whitespace-nowrap">{label}/</span>
      <span
        className="flex-1 border-b border-dotted border-[#888] pb-0.5 text-center"
        style={{ minHeight: "1.1em" }}
      >
        {value}
      </span>
    </div>
  );
}

function LabeledBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 w-20 font-bold text-[#0E5A3A]">{label}:</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
