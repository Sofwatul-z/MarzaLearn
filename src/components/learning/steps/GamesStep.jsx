import QuizGame from "../QuizGame";
import SourceNote from "../../common/SourceNote";

export default function GamesStep({ content, value, onChange, chapterId }) {
  return (
    <div>
      <div className="mb-8 max-w-3xl">
        <span className="ml-eyebrow">Step 06 · Games</span>
        <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-4xl">
          {content.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-[#65736D] sm:text-base">
          One question at a time. Your first answer is final, so read the sentence before you choose.
        </p>
      </div>
      <QuizGame questions={content.questions} value={value} onChange={onChange} chapterId={chapterId} />
      <SourceNote source={content.source} />
    </div>
  );
}
