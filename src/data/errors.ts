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

export const spellingErrors: SpellingError[] = [...commonSpellingErrors, ...additionalPrototypeErrors];

export const spellingCategories = errorGroups.map((group) => group.category) as readonly string[];

export const errorInteractionKinds: readonly ErrorInteraction[] = [
  'replace-character', 'remove-character', 'add-character', 'split-words', 'select-form',
];
