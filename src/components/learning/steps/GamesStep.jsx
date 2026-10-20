import { Gamepad2 } from "lucide-react";
import QuizGame from "../QuizGame";
import SourceNote from "../../common/SourceNote";

export default function GamesStep({ content, value, onChange, chapterId }) {
  return (
    <div>
      <div className="mb-6 max-w-3xl">
        <span className="ml-eyebrow">Step 06 · Games</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">
          One question at a time. Your first answer is final, so read the sentence before you choose.
        </p>
      </div>

      {/* Student Action Instructions in English */}
      <div className="mb-7 rounded-2xl border border-[#D7E3DC] bg-[#EAF4EF]/75 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#355245]">
          <Gamepad2 size={16} className="text-[#355245]" />
          <span>What to Do in this Step:</span>
        </div>
        <ol className="mt-2.5 space-y-1.5 text-xs sm:text-sm font-medium leading-relaxed text-[#4A5D54]">
          <li>1. Read each question and the accompanying context sentence carefully.</li>
          <li>2. Select the best answer option from the multiple-choice list. <em>(Note: Your first selection counts toward your final score!)</em></li>
          <li>3. Answer all questions to complete the 6-Step Mission.</li>
          <li>4. When finished, click <strong>"Complete Mission"</strong> at the bottom to finalize your score and unlock your PjBL project!</li>
        </ol>
      </div>

      <QuizGame questions={content.questions} value={value} onChange={onChange} chapterId={chapterId} />
      <SourceNote source={content.source} />
    </div>
  );
}
