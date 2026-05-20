"use client";

type Props = {
  providerName: string;
  segmentName?: string;
  accentColor?: string;
};

export default function ProviderIntroButton({ providerName, segmentName, accentColor }: Props) {
  const handleClick = () => {
    const text = segmentName
      ? `I'm interested in ${providerName} (${segmentName}). Can you tell me more and help me get connected? My business is: `
      : `I'm interested in ${providerName}. Can you tell me more and help me get connected? My business is: `;

    window.dispatchEvent(
      new CustomEvent("qosvanta:prefill-chat", { detail: { text, providerName } })
    );
  };

  return (
    <button
      onClick={handleClick}
      className="block w-full text-center py-3.5 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
      style={{
        background: accentColor
          ? `linear-gradient(135deg, ${accentColor}, #7C3AED)`
          : "linear-gradient(135deg, #3B82F6, #7C3AED)",
        boxShadow: "0 4px 16px rgba(59,130,246,0.25)",
      }}
    >
      💬 Talk to Damir about {providerName}
    </button>
  );
}
