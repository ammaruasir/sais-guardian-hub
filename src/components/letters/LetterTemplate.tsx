import type { Letter } from "@/data/letters";
import saisEmblem from "@/assets/sais-emblem.png";

export function LetterTemplate({ letter, idForPrint }: { letter: Letter; idForPrint?: string }) {
  return (
    <div
      id={idForPrint ?? "letter-print-area"}
      dir="rtl"
      className="letter-sheet mx-auto bg-white text-[#1a1a1a] shadow-md"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "16mm 14mm",
        fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', serif",
        fontSize: "12pt",
        lineHeight: 1.9,
      }}
    >
      {/* ===== Header ===== */}
      <div className="grid grid-cols-3 items-start gap-4">
        {/* Right: official authority titles */}
        <div className="text-end">
          <div
            className="text-[#0E5A3A] font-bold leading-tight"
            style={{ fontSize: "16pt", letterSpacing: "0.5px" }}
          >
            المملكة العربية السعودية
          </div>
          <div
            className="text-[#0E5A3A] font-bold leading-tight mt-1"
            style={{ fontSize: "15pt" }}
          >
            الهيئة العليا للأمن الصناعي
          </div>
          <div className="mt-1 text-[10pt] text-[#0E5A3A]">(١٨٩)</div>
        </div>

        {/* Center: SAIS emblem */}
        <div className="flex flex-col items-center">
          <img src={saisEmblem} alt="SAIS" className="h-24 w-auto object-contain" />
          <div className="mt-1 text-center text-[8pt] text-[#0E5A3A] font-semibold">
            الهيئة العليا للأمن الصناعي
            <div className="text-[7pt] text-[#0E5A3A]/70">
              Supreme Authority For Industrial Security
            </div>
          </div>
        </div>

        {/* Left: ref / date / attachments */}
        <div className="text-[10pt] space-y-2 pt-2">
          <FieldLine label="الرقم" value={letter.ref} />
          <FieldLine label="التاريخ" value={letter.hijriDate} />
          <FieldLine label="التوابع" value={letter.attachmentsCount ? String(letter.attachmentsCount) : ""} />
        </div>
      </div>

      {/* ===== Bordered body ===== */}
      <div
        className="relative mt-6 rounded-[28px] border-2 border-[#0E5A3A] px-8 pt-10 pb-8"
        style={{ minHeight: "200mm" }}
      >
        {/* Confidential badge */}
        {letter.classified && (
          <div className="absolute -top-3 right-10 bg-white px-3 text-[11pt] font-bold text-[#0E5A3A]">
            برقية سرية
          </div>
        )}

        {/* Addressee */}
        <div className="text-[12pt] leading-loose">
          <div>
            <span className="font-bold">سعادة </span>
            <span>{letter.addresseeAr}</span>
            <span className="float-start font-bold">سلمه الله</span>
          </div>
          <div className="mt-3 font-bold">السلام عليكم ورحمة الله وبركاته،</div>
        </div>

        {/* Reference / Subject / Body labels */}
        <div className="mt-5 space-y-4 text-justify">
          <LabeledBlock label="الإشارة">
            <span>
              بالإشارة إلى الطلب رقم{" "}
              <span className="font-bold">{letter.requestId}</span>{" "}
              المقدّم من{" "}
              <span className="font-bold">{letter.addresseeAr}</span>.
            </span>
          </LabeledBlock>

          <LabeledBlock label="الموضوع">
            <span>{letter.subjectAr}</span>
          </LabeledBlock>

          <LabeledBlock label="الإفادة">
            <div>
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
                    <tr className="bg-[#0E5A3A] text-white">
                      <th className="border border-[#0E5A3A] p-2 text-center w-12">م</th>
                      <th className="border border-[#0E5A3A] p-2 text-start">المستند</th>
                      <th className="border border-[#0E5A3A] p-2 text-start">التعليق</th>
                      <th className="border border-[#0E5A3A] p-2 text-center w-32">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {letter.commentsTable.map((row, i) => (
                      <tr key={i}>
                        <td className="border border-[#0E5A3A]/60 p-2 text-center">{i + 1}</td>
                        <td className="border border-[#0E5A3A]/60 p-2">{row.doc}</td>
                        <td className="border border-[#0E5A3A]/60 p-2">{row.comment}</td>
                        <td className="border border-[#0E5A3A]/60 p-2 text-center">{row.status}</td>
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

          <p className="pt-2">والسلام عليكم ورحمة الله وبركاته،،،</p>
        </div>

        {/* Signature */}
        <div className="mt-12 flex items-end justify-start">
          <div className="text-center">
            <div className="border-b-2 border-dotted border-[#0E5A3A]/70 px-16 pb-1 text-[11pt] font-bold text-[#0E5A3A]">
              {letter.signatoryAr}
            </div>
            <div className="mt-1 text-[10pt] text-[#444]">{letter.signatoryTitleAr}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-[8pt] text-[#666]">
        الرياض — المملكة العربية السعودية | sais.gov.sa
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
