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

export const correctPracticeSentences: readonly string[] = [
  'ذهبت فاطمة إلى المدرسة صباحًا.',
  'قرأت صفحة من كتاب اللغة العربية.',
  'لدي فكرة جديدة تساعد على تحسين التعليم.',
  'شارك أحمد في مسابقة للابتكار.',
  'يحتاج التعلم إلى الاستمرار والممارسة.',
  'هذه تجربة تعليمية بسيطة ومفيدة.',
  'ذهبت الأسرة إلى الحديقة في المساء.',
  'ظهرت نتيجة الاختبار هذا الأسبوع.',
  'استخدام التقنية يجعل التعلم أكثر تفاعلًا.',
  'المشاركة في الأنشطة تساعد على اكتساب الخبرة.',
  'تقدم المؤسسة أدوات تعليمية جديدة.',
  'هذا سؤال يحتاج إلى إجابة واضحة.',
  'تحمل المسؤولية يساعد على النجاح.',
  'القراءة والكتابة مهارتان أساسيتان.',
  'نحتاج إلى بيئة تعليمية تشجع على الابتكار.',
  'بدأ الاجتماع بعد انتهاء المحاضرة.',
  'ذهب المريض إلى المستشفى صباحًا.',
  'كانت الظروف مناسبة لبدء المشروع.',
  'يتميز المكان بمنظر جميل وهادئ.',
  'يساعد التطبيق على اكتشاف الأخطاء المتكررة.',
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
