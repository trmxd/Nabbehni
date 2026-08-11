import { spellingErrors } from '../data/errors';
import type { DetectedError, Difference, SpellingError } from '../types';

const arabicLetter = /[\p{L}\p{M}]/u;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function compareWords(incorrect: string, correct: string, interaction?: SpellingError['interaction']): Difference {
  const before = Array.from(incorrect);
  const after = Array.from(correct);

  if (interaction === 'split-words') {
    const spaceIndex = after.findIndex((character, index) => character === ' ' && before[index] !== ' ');
    return { type: 'split', index: Math.max(0, spaceIndex), incorrectSpan: '', correctSpan: ' ' };
  }

  let prefix = 0;
  while (prefix < before.length && prefix < after.length && before[prefix] === after[prefix]) prefix += 1;

  let suffix = 0;
  while (
    suffix < before.length - prefix &&
    suffix < after.length - prefix &&
    before[before.length - 1 - suffix] === after[after.length - 1 - suffix]
  ) suffix += 1;

  const incorrectSpan = before.slice(prefix, before.length - suffix).join('');
  const correctSpan = after.slice(prefix, after.length - suffix).join('');
  const type = incorrectSpan.length > correctSpan.length
    ? 'remove'
    : incorrectSpan.length < correctSpan.length
      ? 'add'
      : 'replace';

  return { type, index: prefix, incorrectSpan, correctSpan };
}

export function detectErrors(text: string, database: SpellingError[] = spellingErrors): DetectedError[] {
  if (!text.trim()) return [];

  const candidates: DetectedError[] = [];
  const records = [...database].sort((a, b) => b.incorrect.length - a.incorrect.length);

  for (const record of records) {
    const flexiblePhrase = escapeRegExp(record.incorrect).replace(/\s+/g, '\\s+');
    const allowDefiniteArticle = !record.incorrect.includes(' ') && !record.incorrect.startsWith('ال');
    const expression = new RegExp(allowDefiniteArticle ? `(?:ال)?${flexiblePhrase}` : flexiblePhrase, 'gu');
    let match: RegExpExecArray | null;

    while ((match = expression.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const previous = start > 0 ? text[start - 1] : '';
      const next = end < text.length ? text[end] : '';
      if ((previous && arabicLetter.test(previous)) || (next && arabicLetter.test(next))) continue;

      const overlaps = candidates.some((candidate) => start < candidate.end && end > candidate.start);
      if (!overlaps) {
        const hasDefiniteArticle = allowDefiniteArticle && match[0] === `ال${record.incorrect}`;
        const replacementText = hasDefiniteArticle ? `ال${record.correct}` : record.correct;
        candidates.push({
          id: `${record.id}-${start}`,
          record,
          start,
          end,
          matchedText: match[0],
          replacementText,
          difference: compareWords(match[0], replacementText, record.interaction),
        });
      }
    }
  }

  return candidates.sort((a, b) => a.start - b.start);
}

export function applyCorrection(text: string, detected: DetectedError): string {
  return `${text.slice(0, detected.start)}${detected.replacementText}${text.slice(detected.end)}`;
}

export function isCorrectChoice(record: SpellingError, choice: string): boolean {
  if (record.interaction === 'remove-character') return choice === 'remove';
  if (record.interaction === 'split-words' || record.interaction === 'select-form') return choice === record.correct;

  const difference = compareWords(record.incorrect, record.correct, record.interaction);
  return choice === difference.correctSpan;
}
