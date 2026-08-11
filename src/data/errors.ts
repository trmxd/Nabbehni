import type { ErrorInteraction, SpellingError } from '../types';

type WordPair = readonly [incorrect: string, correct: string];

interface ErrorGroup {
  category: string;
  hint: string;
  explanation: (correct: string) => string;
  examples: string[];
  words: readonly WordPair[];
}

const errorGroups: ErrorGroup[] = [
  {
    category: 'التاء المربوطة والهاء',
    hint: 'راجع نهاية الكلمة، وفكّر هل هي اسم مؤنث.',
    explanation: (correct) => `تُكتب كلمة ${correct} بتاء مربوطة في آخرها.`,
    examples: ['شجرة', 'سيارة', 'مكتبة'],
    words: [
      ['مدرسه', 'مدرسة'], ['جامعه', 'جامعة'], ['مكتبه', 'مكتبة'], ['حديقه', 'حديقة'], ['شجره', 'شجرة'],
      ['سياره', 'سيارة'], ['قصه', 'قصة'], ['معلمه', 'معلمة'], ['فاطمه', 'فاطمة'], ['هديه', 'هدية'],
    ],
  },
  {
    category: 'همزة القطع',
    hint: 'انتبه إلى همزة بداية الكلمة.',
    explanation: (correct) => `تبدأ كلمة ${correct} بهمزة قطع ظاهرة في الكتابة.`,
    examples: ['أحمد', 'إجابة', 'إدارة'],
    words: [
      ['الى', 'إلى'], ['الا', 'إلا'], ['اول', 'أول'], ['احمد', 'أحمد'], ['اخذ', 'أخذ'],
      ['اكل', 'أكل'], ['اسد', 'أسد'], ['انسان', 'إنسان'], ['اجابة', 'إجابة'], ['ادارة', 'إدارة'],
    ],
  },
  {
    category: 'همزة الوصل',
    hint: 'جرّب وصل الكلمة بما قبلها؛ تبدأ هذه الكلمة بألف بلا همزة.',
    explanation: (correct) => `تبدأ كلمة ${correct} بهمزة وصل، لذلك تُكتب الألف بلا همزة.`,
    examples: ['اسم', 'ابن', 'استخدام'],
    words: [
      ['إسم', 'اسم'], ['إبن', 'ابن'], ['إبنة', 'ابنة'], ['إمرأة', 'امرأة'], ['إثنان', 'اثنان'],
      ['إثنتان', 'اثنتان'], ['إمتحان', 'امتحان'], ['إستخدام', 'استخدام'], ['إستقبال', 'استقبال'], ['إنتظار', 'انتظار'],
    ],
  },
  {
    category: 'الحروف والألفات الزائدة',
    hint: 'هناك حرف زائد؛ اقرأ الكلمة ببطء وحدد ما يمكن حذفه.',
    explanation: (correct) => `الصيغة الصحيحة هي ${correct} بعد حذف الحرف الزائد.`,
    examples: ['هذا', 'لكن', 'الذي'],
    words: [
      ['هاذا', 'هذا'], ['هاذه', 'هذه'], ['لاكن', 'لكن'], ['ذالك', 'ذلك'], ['اللذي', 'الذي'],
      ['اللذين', 'الذين'], ['هاؤلاء', 'هؤلاء'], ['اولائك', 'أولئك'], ['اللتي', 'التي'], ['الذيين', 'الذين'],
    ],
  },
  {
    category: 'الألف المقصورة والياء',
    hint: 'راجع آخر الكلمة واختر بين الياء والألف المقصورة.',
    explanation: (correct) => `تنتهي كلمة ${correct} بألف مقصورة.`,
    examples: ['مستشفى', 'ذكرى', 'موسى'],
    words: [
      ['مستشفي', 'مستشفى'], ['حتي', 'حتى'], ['متي', 'متى'], ['بلي', 'بلى'], ['اخري', 'أخرى'],
      ['ذكري', 'ذكرى'], ['كبري', 'كبرى'], ['صغري', 'صغرى'], ['موسي', 'موسى'], ['عيسي', 'عيسى'],
    ],
  },
  {
    category: 'الضاد والظاء',
    hint: 'انتبه إلى صوت الحرف: هل تحتاج الكلمة إلى ضاد أم ظاء؟',
    explanation: (correct) => `تُكتب الكلمة ${correct} بهذا الحرف.`,
    examples: ['الظهر', 'الظروف', 'ضرورة'],
    words: [
      ['الضهر', 'الظهر'], ['الضروف', 'الظروف'], ['الحض', 'الحظ'], ['عضيم', 'عظيم'], ['نضيف', 'نظيف'],
      ['وضيفة', 'وظيفة'], ['محفضة', 'محفظة'], ['انتضار', 'انتظار'], ['منضر', 'منظر'], ['ظرورة', 'ضرورة'],
    ],
  },
  {
    category: 'الهمزة المتوسطة والمتطرفة',
    hint: 'راجع موضع الهمزة والحرف الذي تستقر عليه.',
    explanation: (correct) => `موضع الهمزة الصحيح في هذه الكلمة هو: ${correct}.`,
    examples: ['شيء', 'شاطئ', 'مسؤول'],
    words: [
      ['شئ', 'شيء'], ['شاطء', 'شاطئ'], ['قارء', 'قارئ'], ['هادء', 'هادئ'], ['فئه', 'فئة'],
      ['هيئه', 'هيئة'], ['مسوول', 'مسؤول'], ['مسوولية', 'مسؤولية'], ['مفاجاه', 'مفاجأة'], ['تهنئه', 'تهنئة'],
    ],
  },
  {
    category: 'أخطاء الهمزة الشائعة',
    hint: 'ابحث عن موضع الهمزة في وسط الكلمة أو آخرها.',
    explanation: (correct) => `تُكتب الهمزة في هذه الكلمة هكذا: ${correct}.`,
    examples: ['تأثير', 'مؤمن', 'رؤوس'],
    words: [
      ['يقراء', 'يقرأ'], ['تاثير', 'تأثير'], ['مساله', 'مسألة'], ['رئاسه', 'رئاسة'], ['مومن', 'مؤمن'],
      ['شوون', 'شؤون'], ['كفائه', 'كفاءة'], ['جراءه', 'جرأة'], ['لولو', 'لؤلؤ'], ['رووس', 'رؤوس'],
    ],
  },
  {
    category: 'كلمات متعددة المواضع',
    hint: 'راجع الكلمة كاملة؛ فيها أكثر من موضع يستحق الانتباه.',
    explanation: (correct) => `الصيغة الصحيحة للكلمة كاملة هي ${correct}.`,
    examples: ['مبدأ', 'قارئة', 'ملاجئ'],
    words: [
      ['مبدا', 'مبدأ'], ['مبادء', 'مبادئ'], ['قارئه', 'قارئة'], ['ناشئه', 'ناشئة'], ['بريئه', 'بريئة'],
      ['سيئه', 'سيئة'], ['رئه', 'رئة'], ['فجاه', 'فجأة'], ['منشا', 'منشأ'], ['ملاجء', 'ملاجئ'],
    ],
  },
  {
    category: 'كلمات يومية وأكاديمية',
    hint: 'راجع نهاية الكلمة ومواضع الهمزة فيها.',
    explanation: (correct) => `تُكتب هذه الكلمة الشائعة هكذا: ${correct}.`,
    examples: ['اللغة', 'التنمية', 'الكتابة'],
    words: [
      ['اللغه', 'اللغة'], ['العربيه', 'العربية'], ['التربيه', 'التربية'], ['التنميه', 'التنمية'], ['التكنولوجيه', 'التكنولوجية'],
      ['المسؤليه', 'المسؤولية'], ['الاستفاده', 'الاستفادة'], ['المشاركه', 'المشاركة'], ['القراءه', 'القراءة'], ['الكتابه', 'الكتابة'],
    ],
  },
];

const expandedErrorGroups: ErrorGroup[] = [
  {
    category: 'التاء المربوطة والهاء',
    hint: 'راجع نهاية الكلمة، وفكّر هل هي اسم أو صفة مؤنثة.',
    explanation: (correct) => `تُكتب كلمة ${correct} بتاء مربوطة في آخرها.`,
    examples: ['رحلة', 'فكرة', 'رسالة'],
    words: [
      ['رحله', 'رحلة'], ['غرفه', 'غرفة'], ['نافذه', 'نافذة'], ['فرصه', 'فرصة'], ['نتيجه', 'نتيجة'],
      ['طريقه', 'طريقة'], ['مشكله', 'مشكلة'], ['فكره', 'فكرة'], ['بدايه', 'بداية'], ['نهايه', 'نهاية'],
      ['مدينه', 'مدينة'], ['قريه', 'قرية'], ['دوله', 'دولة'], ['شركه', 'شركة'], ['خدمه', 'خدمة'],
      ['صوره', 'صورة'], ['رساله', 'رسالة'], ['صفحه', 'صفحة'], ['خطه', 'خطة'], ['لعبه', 'لعبة'],
    ],
  },
  {
    category: 'همزة القطع',
    hint: 'انتبه إلى همزة بداية الكلمة.',
    explanation: (correct) => `تبدأ كلمة ${correct} بهمزة قطع ظاهرة في الكتابة.`,
    examples: ['أخبار', 'أسئلة', 'أهداف'],
    words: [
      ['اخبار', 'أخبار'], ['اسئلة', 'أسئلة'], ['اسبوع', 'أسبوع'], ['اشخاص', 'أشخاص'], ['اكثر', 'أكثر'],
      ['افضل', 'أفضل'], ['اجمل', 'أجمل'], ['اصعب', 'أصعب'], ['اسهل', 'أسهل'], ['اقرب', 'أقرب'],
      ['ابعد', 'أبعد'], ['اكبر', 'أكبر'], ['اصغر', 'أصغر'], ['اهم', 'أهم'], ['اثر', 'أثر'],
      ['امر', 'أمر'], ['امس', 'أمس'], ['امام', 'أمام'], ['اثناء', 'أثناء'], ['ارقام', 'أرقام'],
      ['ادوات', 'أدوات'], ['اهداف', 'أهداف'], ['اعمال', 'أعمال'], ['اسباب', 'أسباب'], ['انواع', 'أنواع'],
    ],
  },
  {
    category: 'همزة الوصل',
    hint: 'جرّب وصل الكلمة بما قبلها؛ تبدأ هذه الكلمة بألف بلا همزة.',
    explanation: (correct) => `تبدأ كلمة ${correct} بهمزة وصل، لذلك تُكتب الألف بلا همزة.`,
    examples: ['الاستمرار', 'الاجتماع', 'الابتكار'],
    words: [
      ['الإستمرار', 'الاستمرار'], ['الإجتماع', 'الاجتماع'], ['الإنتقال', 'الانتقال'], ['الإعتماد', 'الاعتماد'], ['الإتصال', 'الاتصال'],
      ['الإختبار', 'الاختبار'], ['الإقتراح', 'الاقتراح'], ['الإستجابة', 'الاستجابة'], ['الإستثمار', 'الاستثمار'], ['الإبتكار', 'الابتكار'],
      ['الإحتمال', 'الاحتمال'], ['الإحتفال', 'الاحتفال'], ['الإشتراك', 'الاشتراك'], ['الإكتشاف', 'الاكتشاف'], ['الإستعداد', 'الاستعداد'],
      ['الإستقرار', 'الاستقرار'], ['الإستنتاج', 'الاستنتاج'], ['الإستفسار', 'الاستفسار'], ['الإستكشاف', 'الاستكشاف'], ['الإستيعاب', 'الاستيعاب'],
      ['إختبار', 'اختبار'], ['إجتماع', 'اجتماع'], ['إبتكار', 'ابتكار'], ['إستمرار', 'استمرار'], ['إستكشاف', 'استكشاف'],
    ],
  },
  {
    category: 'الهمزة المتوسطة والمتطرفة',
    hint: 'راجع موضع الهمزة ونهاية الكلمة.',
    explanation: (correct) => `تُكتب هذه الكلمة هكذا: ${correct}.`,
    examples: ['رؤية', 'سؤال', 'مؤسسة'],
    words: [
      ['رؤيه', 'رؤية'], ['تجزئه', 'تجزئة'], ['تنشئه', 'تنشئة'], ['جرئ', 'جريء'], ['بطئ', 'بطيء'],
      ['دفئ', 'دفء'], ['ملئ', 'ملء'], ['جزئ', 'جزء'], ['تاخير', 'تأخير'], ['تاكيد', 'تأكيد'],
      ['تاسيس', 'تأسيس'], ['تاهيل', 'تأهيل'], ['تاجيل', 'تأجيل'], ['تاليف', 'تأليف'], ['تامين', 'تأمين'],
      ['تامل', 'تأمل'], ['تاشيرة', 'تأشيرة'], ['سوال', 'سؤال'], ['موسسة', 'مؤسسة'], ['موسسات', 'مؤسسات'],
      ['موتمر', 'مؤتمر'], ['موتمرات', 'مؤتمرات'], ['موشر', 'مؤشر'], ['موشرات', 'مؤشرات'],
    ],
  },
  {
    category: 'أخطاء الهمزة الشائعة',
    hint: 'راجع موضع الهمزة في الكلمة.',
    explanation: (correct) => `تُكتب الهمزة في هذه الكلمة هكذا: ${correct}.`,
    examples: ['الآن', 'لأنه', 'كأنها'],
    words: [
      ['الان', 'الآن'], ['لانه', 'لأنه'], ['لانها', 'لأنها'], ['لاني', 'لأني'], ['لانني', 'لأنني'],
      ['لانك', 'لأنك'], ['كانه', 'كأنه'], ['كانها', 'كأنها'], ['احدى', 'إحدى'],
    ],
  },
  {
    category: 'الحروف والألفات الزائدة',
    hint: 'هناك حرف زائد؛ اقرأ الكلمة ببطء وحدد ما يمكن حذفه.',
    explanation: (correct) => `الصيغة الصحيحة هي ${correct} بعد حذف الحرف الزائد.`,
    examples: ['هكذا', 'هذا', 'لكن'],
    words: [['هكاذا', 'هكذا']],
  },
];

export interface SpellingSentenceExample {
  wrong: string;
  correct: string;
}

export const spellingSentenceExamples: Readonly<Record<string, SpellingSentenceExample>> = {
  'مدرسه': { wrong: 'ذهبت إلى المدرسه صباحًا.', correct: 'ذهبت إلى المدرسة صباحًا.' },
  'حديقه': { wrong: 'لعب الأطفال في الحديقه.', correct: 'لعب الأطفال في الحديقة.' },
  'مشكله': { wrong: 'وجدت مشكله في السؤال.', correct: 'وجدت مشكلة في السؤال.' },
  'فكره': { wrong: 'لدي فكره جديدة للمشروع.', correct: 'لدي فكرة جديدة للمشروع.' },
  'نتيجه': { wrong: 'ظهرت النتيجه اليوم.', correct: 'ظهرت النتيجة اليوم.' },
  'رساله': { wrong: 'كتبت رساله إلى صديقي.', correct: 'كتبت رسالة إلى صديقي.' },
  'صفحه': { wrong: 'قرأت صفحه من الكتاب.', correct: 'قرأت صفحة من الكتاب.' },
  'سياره': { wrong: 'وصلت السياره إلى المنزل.', correct: 'وصلت السيارة إلى المنزل.' },
  'احمد': { wrong: 'احمد طالب مجتهد.', correct: 'أحمد طالب مجتهد.' },
  'الى': { wrong: 'ذهبت الى الجامعة.', correct: 'ذهبت إلى الجامعة.' },
  'اسئلة': { wrong: 'أجبت عن جميع الاسئلة.', correct: 'أجبت عن جميع الأسئلة.' },
  'اسبوع': { wrong: 'سأعود بعد اسبوع.', correct: 'سأعود بعد أسبوع.' },
  'اهداف': { wrong: 'للمشروع عدة اهداف.', correct: 'للمشروع عدة أهداف.' },
  'ادوات': { wrong: 'استخدمنا ادوات تعليمية جديدة.', correct: 'استخدمنا أدوات تعليمية جديدة.' },
  'إستخدام': { wrong: 'يساعد إستخدام التقنية في التعلم.', correct: 'يساعد استخدام التقنية في التعلم.' },
  'إختبار': { wrong: 'لدي إختبار غدًا.', correct: 'لدي اختبار غدًا.' },
  'إجتماع': { wrong: 'بدأ الإجتماع في الصباح.', correct: 'بدأ الاجتماع في الصباح.' },
  'الإجتماع': { wrong: 'بدأ الإجتماع في الصباح.', correct: 'بدأ الاجتماع في الصباح.' },
  'إبتكار': { wrong: 'يعتمد المشروع على الإبتكار.', correct: 'يعتمد المشروع على الابتكار.' },
  'الإبتكار': { wrong: 'يعتمد المشروع على الإبتكار.', correct: 'يعتمد المشروع على الابتكار.' },
  'إستمرار': { wrong: 'يحتاج التعلم إلى الإستمرار.', correct: 'يحتاج التعلم إلى الاستمرار.' },
  'الإستمرار': { wrong: 'يحتاج التعلم إلى الإستمرار.', correct: 'يحتاج التعلم إلى الاستمرار.' },
  'إستكشاف': { wrong: 'يساعد التطبيق على إستكشاف الكلمات.', correct: 'يساعد التطبيق على استكشاف الكلمات.' },
  'مستشفي': { wrong: 'ذهب المريض إلى المستشفي.', correct: 'ذهب المريض إلى المستشفى.' },
  'حتي': { wrong: 'انتظرت حتي المساء.', correct: 'انتظرت حتى المساء.' },
  'متي': { wrong: 'متي يبدأ الدرس؟', correct: 'متى يبدأ الدرس؟' },
  'اخري': { wrong: 'أريد فرصة اخري.', correct: 'أريد فرصة أخرى.' },
  'ذكري': { wrong: 'هذه ذكري جميلة.', correct: 'هذه ذكرى جميلة.' },
  'الضروف': { wrong: 'كانت الضروف مناسبة.', correct: 'كانت الظروف مناسبة.' },
  'نضيف': { wrong: 'الفصل نضيف ومرتب.', correct: 'الفصل نظيف ومرتب.' },
  'وضيفة': { wrong: 'بحث عن وضيفة جديدة.', correct: 'بحث عن وظيفة جديدة.' },
  'انتضار': { wrong: 'استمر الانتضار طويلًا.', correct: 'استمر الانتظار طويلًا.' },
  'منضر': { wrong: 'هذا منضر جميل.', correct: 'هذا منظر جميل.' },
  'ظرورة': { wrong: 'التدريب ظرورة للتطور.', correct: 'التدريب ضرورة للتطور.' },
  'سوال': { wrong: 'لدي سوال مهم.', correct: 'لدي سؤال مهم.' },
  'مسوول': { wrong: 'هو مسوول عن المشروع.', correct: 'هو مسؤول عن المشروع.' },
  'مسوولية': { wrong: 'التعلم مسوولية مشتركة.', correct: 'التعلم مسؤولية مشتركة.' },
  'بيئه': { wrong: 'نحتاج إلى بيئه تعليمية جيدة.', correct: 'نحتاج إلى بيئة تعليمية جيدة.' },
  'موسسة': { wrong: 'تعمل الموسسة في مجال التعليم.', correct: 'تعمل المؤسسة في مجال التعليم.' },
  'موتمر': { wrong: 'شاركت في موتمر تقني.', correct: 'شاركت في مؤتمر تقني.' },
  'قارء': { wrong: 'كل قارء له أسلوبه.', correct: 'كل قارئ له أسلوبه.' },
  'هادء': { wrong: 'المكان هادء اليوم.', correct: 'المكان هادئ اليوم.' },
  'اللغه': { wrong: 'أحب تعلم اللغه العربية.', correct: 'أحب تعلم اللغة العربية.' },
  'العربيه': { wrong: 'العربيه لغة غنية.', correct: 'العربية لغة غنية.' },
  'التربيه': { wrong: 'تساهم التربيه في بناء المجتمع.', correct: 'تساهم التربية في بناء المجتمع.' },
  'التنميه': { wrong: 'التعليم أساس التنميه.', correct: 'التعليم أساس التنمية.' },
  'المشاركه': { wrong: 'أحب المشاركه في المسابقات.', correct: 'أحب المشاركة في المسابقات.' },
  'القراءه': { wrong: 'القراءه عادة مفيدة.', correct: 'القراءة عادة مفيدة.' },
  'الكتابه': { wrong: 'أمارس الكتابه يوميًا.', correct: 'أمارس الكتابة يوميًا.' },
};

function getChangedSpans(incorrect: string, correct: string) {
  const before = Array.from(incorrect);
  const after = Array.from(correct);
  let prefix = 0;
  while (prefix < before.length && prefix < after.length && before[prefix] === after[prefix]) prefix += 1;

  let suffix = 0;
  while (
    suffix < before.length - prefix
    && suffix < after.length - prefix
    && before[before.length - 1 - suffix] === after[after.length - 1 - suffix]
  ) suffix += 1;

  return {
    incorrectSpan: before.slice(prefix, before.length - suffix).join(''),
    correctSpan: after.slice(prefix, after.length - suffix).join(''),
  };
}

const characterAlternatives: Record<string, string[]> = {
  'ة': ['ه', 'ت'], 'ه': ['ة', 'ت'],
  'أ': ['ا', 'إ'], 'إ': ['ا', 'أ'], 'ا': ['أ', 'إ'],
  'ى': ['ي', 'ا'], 'ي': ['ى', 'ئ'],
  'ظ': ['ض', 'ذ'], 'ض': ['ظ', 'د'],
  'ؤ': ['و', 'أ'], 'ئ': ['ء', 'ي'], 'ء': ['ئ', 'ؤ'],
};

function buildInteraction(incorrect: string, correct: string): Pick<SpellingError, 'interaction' | 'choices'> {
  const { incorrectSpan, correctSpan } = getChangedSpans(incorrect, correct);
  const beforeLength = Array.from(incorrectSpan).length;
  const afterLength = Array.from(correctSpan).length;

  if (correctSpan === '') return { interaction: 'remove-character' };
  if (incorrectSpan === '' && afterLength === 1) {
    return { interaction: 'add-character', choices: [correctSpan, ...(characterAlternatives[correctSpan] ?? ['ا', 'ي'])].slice(0, 3) };
  }
  if (beforeLength === 1 && afterLength === 1) {
    const choices = [incorrectSpan, correctSpan, ...(characterAlternatives[correctSpan] ?? ['ا'])]
      .filter((choice, index, all) => choice && all.indexOf(choice) === index)
      .slice(0, 3);
    return { interaction: 'replace-character', choices };
  }
  return { interaction: 'select-form', choices: [correct, incorrect] };
}

export const commonSpellingErrors: SpellingError[] = errorGroups.flatMap((group, groupIndex) => (
  group.words.map(([incorrect, correct], wordIndex) => ({
    id: `common-${String(groupIndex * 10 + wordIndex + 1).padStart(3, '0')}`,
    incorrect,
    correct,
    category: group.category,
    hint: group.hint,
    explanation: group.explanation(correct),
    examples: group.examples,
    ...buildInteraction(incorrect, correct),
  }))
));

let expandedRecordIndex = 0;
export const expandedSpellingErrors: SpellingError[] = expandedErrorGroups.flatMap((group) => (
  group.words.map(([incorrect, correct]) => ({
    id: `expanded-${String(++expandedRecordIndex).padStart(3, '0')}`,
    incorrect,
    correct,
    category: group.category,
    hint: group.hint,
    explanation: group.explanation(correct),
    examples: group.examples,
    ...buildInteraction(incorrect, correct),
  }))
));

const additionalPrototypeErrors: SpellingError[] = [
  {
    id: 'because-hamza', incorrect: 'لان', correct: 'لأن', category: 'أخطاء الهمزة الشائعة',
    hint: 'توجد همزة في وسط الكلمة.', explanation: 'تُكتب لأن بهمزة فوق الألف.',
    choices: ['ا', 'أ', 'إ'], interaction: 'replace-character', examples: ['لأن', 'سأل', 'رأس'],
  },
  {
    id: 'inshallah-spaced', incorrect: 'انشاء الله', correct: 'إن شاء الله', category: 'الفصل والوصل',
    hint: 'العبارة تتكون من ثلاث كلمات.', explanation: 'الصواب: إن شاء الله، وليست كلمة واحدة.',
    choices: ['إن شاء الله', 'إنشاء الله', 'انشاءالله'], interaction: 'split-words',
  },
  {
    id: 'inshallah-joined', incorrect: 'إنشاءالله', correct: 'إن شاء الله', category: 'الفصل والوصل',
    hint: 'افصل الكلمات.', explanation: 'الصواب: إن شاء الله.',
    choices: ['إن شاء الله', 'إنشاء الله', 'إن شاءالله'], interaction: 'split-words',
  },
  {
    id: 'responsibility-short', incorrect: 'مسؤليه', correct: 'مسؤولية', category: 'كلمات متعددة المواضع',
    hint: 'راجع وسط الكلمة ونهايتها.', explanation: 'الصواب مسؤولية: واو بعدها همزة، وتنتهي بتاء مربوطة.',
    choices: ['مسؤولية', 'مسئوليه', 'مسؤليه'], interaction: 'select-form',
  },
  {
    id: 'reading-short', incorrect: 'قراءه', correct: 'قراءة', category: 'التاء المربوطة والهاء',
    hint: 'الكلمة مصدر مؤنث.', explanation: 'تُكتب قراءة بتاء مربوطة.',
    choices: ['ه', 'ة', 'ت'], interaction: 'replace-character', examples: ['كتابة', 'دراسة', 'قراءة'],
  },
  {
    id: 'environment', incorrect: 'بيئه', correct: 'بيئة', category: 'التاء المربوطة والهاء',
    hint: 'راجع نهاية الكلمة.', explanation: 'تُكتب بيئة بتاء مربوطة.',
    choices: ['ه', 'ة', 'ت'], interaction: 'replace-character', examples: ['فئة', 'هيئة', 'بيئة'],
  },
  {
    id: 'girl', incorrect: 'فتاه', correct: 'فتاة', category: 'التاء المربوطة والهاء',
    hint: 'راجع آخر حرف.', explanation: 'تُكتب فتاة بتاء مربوطة.',
    choices: ['ه', 'ة', 'ت'], interaction: 'replace-character', examples: ['قناة', 'نجاة', 'فتاة'],
  },
  {
    id: 'circumstances-without-article', incorrect: 'ضروف', correct: 'ظروف', category: 'الضاد والظاء',
    hint: 'انتبه إلى صوت الحرف: هل تحتاج الكلمة إلى ضاد أم ظاء؟', explanation: 'تُكتب كلمة ظروف بالظاء.',
    choices: ['ض', 'ظ', 'ذ'], interaction: 'replace-character', examples: ['ظرف', 'ظروف', 'انتظار'],
  },
  {
    id: 'difficult-feminine', incorrect: 'صعبه', correct: 'صعبة', category: 'التاء المربوطة والهاء',
    hint: 'الكلمة صفة مؤنثة؛ راجع الحرف الأخير.', explanation: 'تُكتب صعبة بتاء مربوطة في آخرها.',
    choices: ['ه', 'ة', 'ت'], interaction: 'replace-character', examples: ['سهلة', 'سريعة', 'جميلة'],
  },
];

export const spellingErrors: SpellingError[] = [
  ...commonSpellingErrors,
  ...additionalPrototypeErrors,
  ...expandedSpellingErrors,
].map((record) => {
  const sentenceExample = spellingSentenceExamples[record.incorrect];
  return sentenceExample
    ? { ...record, wrongExample: sentenceExample.wrong, correctExample: sentenceExample.correct }
    : record;
});

export const spellingCategories = Array.from(new Set(spellingErrors.map((record) => record.category))) as readonly string[];

export const errorInteractionKinds: readonly ErrorInteraction[] = [
  'replace-character', 'remove-character', 'add-character', 'split-words', 'select-form',
];
