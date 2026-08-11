export interface WritingExample {
  id: string;
  title: string;
  text: string;
}

export const writingExamples: WritingExample[] = [
  { id: 'school', title: 'المدرسة', text: 'ذهبت فاطمه إلى المدرسه' },
  { id: 'teacher', title: 'المعلمة', text: 'دخلت المعلمه إلى المكتبه' },
  { id: 'garden', title: 'الحديقة', text: 'قرأت قصه قرب شجره في الحديقه' },
  { id: 'university', title: 'الجامعة', text: 'هاذا اول يوم لي في الجامعه' },
  { id: 'exam', title: 'الامتحان', text: 'احمد ينتظر موعد إمتحان الجامعه' },
  { id: 'hospital', title: 'المستشفى', text: 'ذهبت إلى المستشفي حتي الضهر' },
  { id: 'work', title: 'العمل', text: 'هاؤلاء يعملون في ضروف صعبه' },
  { id: 'beach', title: 'الشاطئ', text: 'هاذا شاطء هادء ونضيف' },
  { id: 'technology', title: 'التقنية', text: 'تاثير التكنولوجيه على اللغه العربيه كبير' },
  { id: 'participation', title: 'المشاركة', text: 'تزيد كفائه المشاركه والاستفاده من القراءه' },
];

export function pickRandomWritingExample(
  currentText = '',
  random: () => number = Math.random,
): WritingExample {
  const available = writingExamples.filter((example) => example.text !== currentText);
  const pool = available.length ? available : writingExamples;
  const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
  return pool[Math.max(0, index)];
}
