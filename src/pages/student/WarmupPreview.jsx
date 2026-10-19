import { useState } from "react";
import StepProgress from "../../components/learning/StepProgress";
import StepHeroHeader from "../../components/learning/StepHeroHeader";
import ProvideStep from "../../components/learning/steps/ProvideStep";
import { getChapterContent } from "../../data/chapters";
import { getStepAsset } from "../../data/stepAssets";

export default function WarmupPreview() {
  const chapter = getChapterContent(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [provideData, setProvideData] = useState({ seen: [0] });

  const asset = getStepAsset(1, 1);
  const ready = (provideData?.seen?.length ?? 0) >= (chapter?.marzano?.provide?.vocabulary?.length ?? 6);

  return (
    <div className="pb-16" style={{ backgroundColor: "#F8F5EC", minHeight: "100vh" }}>
      {/* Chapter Mission Bar */}
      <section className="border-b border-[#E2E8E4] pb-3 mb-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="ml-eyebrow text-[#183B40]">Chapter 01 · Focus session</span>
            <h1 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[#183B40] sm:text-3xl">
              {chapter.title} · 6-Step Mission
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#63B7A8]">
            ● Active Warm-up Session
          </span>
        </div>
        <StepProgress
          currentStep={currentStep}
          highestUnlocked={1}
          completedSteps={ready ? [1] : []}
          onSelect={(stepNum) => setCurrentStep(stepNum)}
        />
      </section>

      {/* Environmental Hero Section */}
      <StepHeroHeader
        asset={asset}
        currentStep={currentStep}
        totalSteps={6}
        isReady={ready}
        chapterId={1}
      />

      {/* Active Step Content (Provide Step with contextual equipment cards) */}
      <section data-step-content className="mt-8 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <ProvideStep
          content={chapter.marzano.provide}
          value={provideData}
          onChange={(newVal) => setProvideData(newVal)}
          chapterId={1}
        />
      </section>
    </div>
  );
}
