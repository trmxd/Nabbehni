import type { DetectedError } from '../types';
import { SmartWord } from './SmartWord';

export function AnalyzedText({
  text,
  detections,
  onSelect,
  animations = true,
  writingSurface = false,
}: {
  text: string;
  detections: DetectedError[];
  onSelect: (detection: DetectedError, anchorElement: HTMLButtonElement) => void;
  animations?: boolean;
  writingSurface?: boolean;
}) {
  const textClasses = writingSurface
    ? 'text-[1.35rem] font-medium leading-9 text-brand-black sm:text-2xl'
    : 'text-[1.35rem] leading-[2.4] text-brand-black sm:text-2xl';

  if (!detections.length) {
    return <p className={`whitespace-pre-wrap break-words ${textClasses}`}>{text}</p>;
  }

  const segments: Array<{ text: string; detection?: DetectedError }> = [];
  let cursor = 0;
  detections.forEach((detection) => {
    if (detection.start > cursor) segments.push({ text: text.slice(cursor, detection.start) });
    segments.push({ text: detection.matchedText, detection });
    cursor = detection.end;
  });
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });

  return (
    <div className={`whitespace-pre-wrap break-words ${textClasses}`} aria-live="polite">
      {segments.map((segment, index) => segment.detection ? (
        <SmartWord
          key={segment.detection.id}
          detection={segment.detection}
          onClick={(anchorElement) => onSelect(segment.detection!, anchorElement)}
          animate={animations}
          writingSurface={writingSurface}
        />
      ) : <span key={`text-${index}`}>{segment.text}</span>)}
    </div>
  );
}
