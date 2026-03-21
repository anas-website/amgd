/** @typedef {'en'|'ar'|'he'} Locale */

export const locales = /** @type {const} */ (['en', 'ar', 'he']);

export const localeNames = {
  en: 'English',
  ar: 'العربية',
  he: 'עברית',
};

/** @type {Record<string, Record<Locale, string>>} */
export const messages = {
  // Common
  'brand.name': {
    en: 'Crystal Clear',
    ar: 'كريستال كلير',
    he: 'קריסטל קליר',
  },
  'common.loading': { en: 'Loading…', ar: 'جاري التحميل…', he: 'טוען…' },
  'common.close': { en: 'Close', ar: 'إغلاق', he: 'סגירה' },
  'common.menu': { en: 'Menu', ar: 'القائمة', he: 'תפריט' },
  'common.from': { en: 'From', ar: 'من', he: 'מ-' },
  'common.ilsPerM2': { en: 'ILS/m²', ar: '₪/م²', he: '₪/מ״ר' },

  // Nav
  'nav.home': { en: 'Home', ar: 'الرئيسية', he: 'בית' },
  'nav.catalog': { en: 'Catalog', ar: 'المعرض', he: 'קטלוג' },
  'nav.designer': { en: '3D Designer', ar: 'المصمّم ثلاثي الأبعاد', he: 'מעצב תלת־ממד' },
  'nav.admin': { en: 'Admin', ar: 'الإدارة', he: 'ניהול' },

  // Footer
  'footer.tagline': {
    en: 'Premium custom shower glass enclosures. Design your bathroom with tempered glass and expert installation.',
    ar: 'أبواب ودوش زجاجية فاخرة حسب الطلب. صمّم حمامك بزجاج مقسّى وتركيب احترافي.',
    he: 'מקלחוני זכוכית פרימיום בהתאמה אישית. עיצוב חדר הרחצה בזכוכית מחוסמת ומתקינים מקצועיים.',
  },
  'footer.contact': { en: 'Contact', ar: 'اتصل بنا', he: 'יצירת קשר' },
  'footer.follow': { en: 'Follow', ar: 'تابعنا', he: 'עקבו אחרינו' },
  'footer.rights': {
    en: 'All rights reserved.',
    ar: 'جميع الحقوق محفوظة.',
    he: 'כל הזכויות שמורות.',
  },
  'footer.privacy': { en: 'Privacy', ar: 'الخصوصية', he: 'פרטיות' },
  'footer.terms': { en: 'Terms', ar: 'الشروط', he: 'תנאים' },

  // Catalog
  'catalog.hero.title': {
    en: 'Shower Glass Collection',
    ar: 'مجموعة زجاج الدش',
    he: 'אוסף מקלחוני זכוכית',
  },
  'catalog.hero.highlight': { en: 'Premium', ar: 'فاخر', he: 'פרימיום' },
  'catalog.hero.sub': {
    en: 'Custom enclosures for modern bathrooms. Explore styles and get an instant estimate.',
    ar: 'حلول مخصصة لحمامات عصرية. استكشف التصاميم واحصل على تقدير فوري.',
    he: 'פתרונות מותאמים אישית לחדרי רחצה מודרניים. גלו דגמים וקבלו הערכת מחיר מיידית.',
  },
  'catalog.badge.series': { en: 'Premium Series', ar: 'سلسلة فاخرة', he: 'סדרת פרימיום' },
  'catalog.empty.title': {
    en: 'No models available',
    ar: 'لا توجد نماذج حالياً',
    he: 'אין דגמים זמינים כרגע',
  },
  'catalog.empty.sub': {
    en: 'Please check back later or contact us.',
    ar: 'يرجى المحاولة لاحقاً أو التواصل معنا.',
    he: 'נסו שוב מאוחר יותר או צרו קשר.',
  },
  'catalog.tag.customSizing': { en: 'Custom sizing', ar: 'قياسات مخصصة', he: 'מידות בהתאמה' },
  'catalog.tag.tempered': { en: '10mm tempered', ar: 'زجاج مقسّى 10 مم', he: 'זכוכית 10 מ"מ מחוסמת' },

  // Product
  'product.back': { en: 'Back to catalog', ar: 'العودة للمعرض', he: 'חזרה לקטלוג' },
  'product.notFound': { en: 'Product not found', ar: 'المنتج غير موجود', he: 'המוצר לא נמצא' },
  'product.verified': { en: 'Verified design', ar: 'تصميم معتمد', he: 'עיצוב מאומת' },
  'product.basePrice': { en: 'Base price', ar: 'السعر الأساسي', he: 'מחיר בסיס' },
  'product.includes': { en: 'Includes', ar: 'يشمل', he: 'כולל' },
  'product.tag.glass': { en: '10mm glass', ar: 'زجاج 10 مم', he: 'זכוכית 10 מ״מ' },
  'product.tag.hinges': { en: 'Hinges', ar: 'مفصلات', he: 'צירים' },
  'product.tag.fitting': { en: 'Fitting', ar: 'تركيب', he: 'אביזרי התקנה' },
  'product.cta3d': { en: 'Open 3D designer', ar: 'فتح المصمّم ثلاثي الأبعاد', he: 'פתיחת מעצב תלת־ממד' },
  'product.descFallback': {
    en: 'Precision tempered glass with premium hardware.',
    ar: 'زجاج مقسّى بدقة مع تجهيزات عالية الجودة.',
    he: 'זכוכית מחוסמת מדויקת עם אביזרי פרימיום.',
  },

  // Calculator
  'calc.title': { en: 'Instant quote', ar: 'عرض سعر فوري', he: 'הצעת מחיר מיידית' },
  'calc.sub': {
    en: 'Estimate based on dimensions and service rules.',
    ar: 'تقدير بناءً على الأبعاد وقواعد الخدمة.',
    he: 'הערכה לפי מידות וכללי שירות.',
  },
  'calc.width': { en: 'Width (cm)', ar: 'العرض (سم)', he: 'רוחב (ס״מ)' },
  'calc.height': { en: 'Height (cm)', ar: 'الارتفاع (سم)', he: 'גובה (ס״מ)' },
  'calc.location': { en: 'Installation area', ar: 'منطقة التركيب', he: 'אזור התקנה' },
  'calc.locationPlaceholder': {
    en: 'Select your area…',
    ar: 'اختر منطقتك…',
    he: 'בחרו אזור…',
  },
  'calc.floor': { en: 'Floor level', ar: 'الطابق', he: 'קומה' },
  'calc.floor.ground': { en: '0', ar: '0', he: '0' },
  'calc.total': { en: 'Estimated total', ar: 'الإجمالي التقديري', he: 'סה״כ משוער' },
  'calc.currency': { en: 'ILS', ar: '₪', he: '₪' },
  'calc.book': { en: 'Request booking', ar: 'طلب حجز', he: 'בקשת תיאום' },
  'calc.disclaimer': {
    en: 'Estimates include premium hardware where applicable. Final price after site survey.',
    ar: 'التقديرات تشمل التجهيزات عند الاقتضاء. السعر النهائي بعد المعاينة.',
    he: 'ההערכות כוללות חומרה פרימיום לפי העניין. מחיר סופי לאחר סיור בשטח.',
  },

  // Designer page
  'designer.title': {
    en: '3D shower designer',
    ar: 'مصمّم الدش ثلاثي الأبعاد',
    he: 'מעצב מקלחון תלת־ממד',
  },
  'designer.sub.custom': {
    en: 'Create your own shower glass design',
    ar: 'صمّم دشك الزجاجي بنفسك',
    he: 'צרו עיצוב מקלחון משלכם',
  },
  'designer.sub.model': {
    en: 'Model',
    ar: 'النموذج',
    he: 'דגם',
  },
  'designer.sub.price': { en: 'Price', ar: 'السعر', he: 'מחיר' },
  'designer.reset': { en: 'Reset', ar: 'إعادة ضبط', he: 'איפוס' },
  'designer.configure': { en: 'Configure', ar: 'الإعدادات', he: 'הגדרות' },
  'designer.hint.orbit': {
    en: 'Drag to rotate · Pinch to zoom',
    ar: 'اسحب للدوران · قرص للتقريب',
    he: 'גרירה לסיבוב · צביטה לזום',
  },
  'designer.hint.door': {
    en: 'Tap the door to open / close',
    ar: 'اضغط على الباب للفتح/الإغلاق',
    he: 'הקישו על הדלת לפתיחה/סגירה',
  },
  'designer.edge': {
    en: 'Edge',
    ar: 'الحافة',
    he: 'קצה',
  },
  'designer.ar.viewInAr': { en: 'View in AR', ar: 'عرض بالواقع المعزّز', he: 'צפייה ב-AR' },
  'designer.ar.preparing': { en: 'Preparing model…', ar: 'جاري تجهيز النموذج…', he: 'מכין מודל…' },
  'designer.ar.openAr': { en: 'Open in AR', ar: 'فتح بالواقع المعزّز', he: 'פתיחה ב-AR' },
  'designer.ar.unsupported': {
    en: 'AR is not available in this browser. Use Safari on iPhone or Chrome on a recent Android phone over HTTPS.',
    ar: 'الواقع المعزّز غير متاح في هذا المتصفح. جرّب Safari على آيفون أو Chrome على أندرويد عبر HTTPS.',
    he: 'AR לא זמין בדפדפן זה. נסו Safari באייפון או Chrome באנדרואיד (HTTPS).',
  },
  'designer.ar.exportFailed': {
    en: 'Could not export the 3D model for AR. Try simplifying the view or use another browser.',
    ar: 'تعذّر تصدير النموذج للواقع المعزّز. جرّب متصفحاً آخر.',
    he: 'ייצוא המודל ל-AR נכשל. נסו דפדפן אחר.',
  },

  // Options panel
  'opt.title': { en: 'Design your shower', ar: 'صمّم دشك', he: 'עיצוב המקלחון' },
  'opt.dimensions': { en: 'Dimensions (cm)', ar: 'الأبعاد (سم)', he: 'מידות (ס״מ)' },
  'opt.width': { en: 'Width', ar: 'العرض', he: 'רוחב' },
  'opt.height': { en: 'Height', ar: 'الارتفاع', he: 'גובה' },
  'opt.depth': { en: 'Depth', ar: 'العمق', he: 'עומק' },
  'opt.doorGap': { en: 'Door gap (mm)', ar: 'فتحة الباب (مم)', he: 'רווח דלת (מ״מ)' },
  'opt.doorBottomGap': { en: 'Door bottom gap (mm)', ar: 'فتحة أسفل الباب (مم)', he: 'רווח תחתון לדלת (מ״מ)' },
  'opt.doorWidthStraight': {
    en: 'Door width (cm) — straight',
    ar: 'عرض الباب (سم) — مستقيم',
    he: 'רוחב דלת (ס״מ) — ישר',
  },
  'opt.doorWidthHelp': {
    en: 'Fixed panel uses remaining width. Empty = 60% door / 40% fixed.',
    ar: 'اللوح الثابت يأخذ الباقي. فارغ = 60٪ باب / 40٪ ثابت.',
    he: 'הכנף הקבועה משתמשת בשאר הרוחב. ריק = 60% דלת / 40% קבוע.',
  },
  'opt.accessories': { en: 'Accessories & view', ar: 'الإكسسوارات والعرض', he: 'אביזרים ותצוגה' },
  'opt.blackFrame': { en: 'Black frame', ar: 'إطار أسود', he: 'מסגרת שחורה' },
  'opt.showEdgeMs': { en: 'Show edge measurements', ar: 'عرض قياسات الحواف', he: 'הצגת מידות קצוות' },
  'opt.showWalls': {
    en: 'Show room walls',
    ar: 'عرض جدران الغرفة',
    he: 'הצגת קירות החדר',
  },
  'opt.roomDims': { en: 'Room interior (cm)', ar: 'داخل الغرفة (سم)', he: 'פנים החדר (ס״מ)' },
  'opt.roomHelp': {
    en: 'Defaults match main dimensions. Box origin from back–left floor corner (cm).',
    ar: 'الافتراضات تطابق الأبعاد الرئيسية. موضع الصندوق من زاوية الأرضية الخلفية اليسرى (سم).',
    he: 'ברירות המחדל תואמות למידות הראשיות. מקום קופסה מפינת הרצפה האחורית־שמאלית (ס״מ).',
  },
  'opt.wallOffset': {
    en: 'Wall offset (cm)',
    ar: 'إزاحة الجدار (سم)',
    he: 'היסט קיר (ס״מ)',
  },
  'opt.wallZ': {
    en: 'Walls on Z (cm)',
    ar: 'الجدران على المحور Z (سم)',
    he: 'קירות על ציר Z (ס״מ)',
  },
  'opt.leftWallLen': { en: 'Left wall length', ar: 'طول الجدار الأيسر', he: 'אורך קיר שמאל' },
  'opt.rightWallLen': { en: 'Right wall length', ar: 'طول الجدار الأيمن', he: 'אורך קיר ימין' },
  'opt.boxesTitle': { en: 'Boxes on walls / floor', ar: 'صناديق على الجدران/الأرضية', he: 'קופסאות על קירות/רצפה' },
  'opt.boxPlace': { en: 'Place', ar: 'المكان', he: 'מיקום' },
  'opt.floor': { en: 'Floor', ar: 'الأرضية', he: 'רצפה' },
  'opt.backWall': { en: 'Back wall', ar: 'الجدار الخلفي', he: 'קיר אחורי' },
  'opt.leftWall': { en: 'Left wall', ar: 'الجدار الأيسر', he: 'קיר שמאל' },
  'opt.rightWall': { en: 'Right wall', ar: 'الجدار الأيمن', he: 'קיר ימין' },
  'opt.add': { en: 'Add', ar: 'إضافة', he: 'הוספה' },
  'opt.showRoomWidth': {
    en: 'Show internal width (left → right)',
    ar: 'عرض العرض الداخلي (يسار → يمين)',
    he: 'הצגת רוחב פנימי (שמאל → ימין)',
  },
  'opt.showBoxLabels': {
    en: 'Show box dimensions (extension lines)',
    ar: 'عرض أبعاد الصناديق (خطوط امتداد)',
    he: 'מידות קופסאות (קווי הארכה)',
  },
  'opt.advancedView': { en: 'CAD view options', ar: 'خيارات العرض CAD', he: 'אפשרויות תצוגת CAD' },
  'opt.showEdges': { en: 'Show 3D edges', ar: 'إظهار حواف ثلاثية الأبعاد', he: 'הצגת קצוות תלת־ממד' },
  'opt.showOrigin': { en: 'Show origin axes', ar: 'إظهار محاور الأصل', he: 'הצגת צירי מקור' },
  'opt.view': { en: 'View', ar: 'المنظور', he: 'תצוגה' },
  'opt.view.free': { en: 'Free (orbit)', ar: 'حر (مدار)', he: 'חופשי (מסלול)' },
  'opt.view.front': { en: 'Front', ar: 'أمامي', he: 'חזית' },
  'opt.view.top': { en: 'Top', ar: 'علوي', he: 'מלמעלה' },
  'opt.view.right': { en: 'Right', ar: 'يمين', he: 'מימין' },
  'opt.perspective': { en: 'Perspective', ar: 'منظور', he: 'פרספקטיבה' },
  'opt.handle': { en: 'Handle style', ar: 'نمط المقبض', he: 'סגנון ידית' },
  'opt.handle.modern': { en: 'Modern square', ar: 'مربع عصري', he: 'מרובע מודרני' },
  'opt.handle.round': { en: 'Classic round', ar: 'دائري كلاسيكي', he: 'עגול קלאסי' },
  'opt.handle.knob': { en: 'Minimal knob', ar: 'زر بسيط', he: 'ידית עגולה מינימלית' },
  'opt.hinge': { en: 'Hinge style', ar: 'نمط المفصلة', he: 'סגנון ציר' },
  'opt.hinge.standard': { en: 'Wall mount', ar: 'تثبيت على الحائط', he: 'התקנה לקיר' },
  'opt.hinge.pivot': { en: 'Pivot', ar: 'محور دوار', he: 'ציר מסתובב' },
  'opt.hinge.gg': { en: 'Glass to glass', ar: 'زجاج إلى زجاج', he: 'זכוכית לזכוכית' },
  'opt.frameColor': { en: 'Frame & metal color', ar: 'لون الإطار والمعدن', he: 'צבע מסגרת ומתכת' },
  'opt.export': { en: 'Export', ar: 'تصدير', he: 'ייצוא' },
  'opt.exportDxf': { en: 'Export door DXF', ar: 'تصدير DXF للباب', he: 'ייצוא DXF לדלת' },
  'opt.exportHelp': {
    en: 'Door outline + hinge & handle holes',
    ar: 'محيط الباب + ثقوب المفصلة والمقبض',
    he: 'קו מתאר + חורי ציר וידית',
  },

  // Layout selector
  'layout.title': { en: 'Layout', ar: 'التخطيط', he: 'פריסה' },
  'layout.straight': { en: 'Straight', ar: 'مستقيم', he: 'ישר' },
  'layout.corner': { en: 'Corner', ar: 'زاوية', he: 'פינה' },
  'layout.lShape': { en: 'L-shape', ar: 'على شكل L', he: 'בצורת L' },
  'layout.lShape2': { en: 'L two doors', ar: 'L ببابين', he: 'L שני דלתות' },

  // Admin
  'admin.panel': { en: 'Manager panel', ar: 'لوحة الإدارة', he: 'לוח ניהול' },
  'admin.menu.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم', he: 'לוח בקרה' },
  'admin.menu.showerTypes': { en: 'Shower types', ar: 'أنواع الدش', he: 'סוגי מקלחונים' },
  'admin.menu.pricing': { en: 'Pricing rules', ar: 'قواعد التسعير', he: 'כללי תמחור' },
  'admin.menu.locations': { en: 'Locations', ar: 'المواقع', he: 'מיקומים' },
  'admin.welcome.title': {
    en: 'Welcome',
    ar: 'مرحباً',
    he: 'ברוכים הבאים',
  },
  'admin.welcome.sub': {
    en: 'Choose a section from the sidebar.',
    ar: 'اختر قسماً من الشريط الجانبي.',
    he: 'בחרו פרק מסרגל הצד.',
  },
  'admin.logout': { en: 'Log out', ar: 'تسجيل الخروج', he: 'התנתקות' },
  'admin.login.title': { en: 'Manager sign-in', ar: 'دخول المشرف', he: 'כניסת מנהל' },
  'admin.login.sub': {
    en: 'Sign in to manage the store',
    ar: 'سجّل الدخول لإدارة المتجر',
    he: 'התחברו לניהול החנות',
  },
  'admin.login.email': { en: 'Email', ar: 'البريد', he: 'אימייל' },
  'admin.login.password': { en: 'Password', ar: 'كلمة المرور', he: 'סיסמה' },
  'admin.login.submit': { en: 'Sign in', ar: 'دخول', he: 'כניסה' },
  'admin.login.loading': { en: 'Signing in…', ar: 'جاري الدخول…', he: 'מתחבר…' },
  'admin.login.noAccess': {
    en: "You're signed in but don't have manager access.",
    ar: 'أنت مسجّل لكن لا تملك صلاحية الإدارة.',
    he: 'אתם מחוברים אך אין הרשאת ניהול.',
  },

  // 3D dimension labels (CAD-style)
  'dim.overallWidth': { en: 'Overall width', ar: 'العرض الكلي', he: 'רוחב כולל' },
  'dim.height': { en: 'Height', ar: 'الارتفاع', he: 'גובה' },
  'dim.depth': { en: 'Depth', ar: 'العمق', he: 'עומק' },
  'dim.doorWidth': { en: 'Door width', ar: 'عرض الباب', he: 'רוחב דלת' },
  'dim.doorFront': { en: 'Front door width', ar: 'عرض الباب الأمامي', he: 'רוחב דלת קדמית' },
  'dim.doorSide': { en: 'Side door width', ar: 'عرض الباب الجانبي', he: 'רוחב דלת צד' },
  'dim.roomWidth': { en: 'Room width', ar: 'عرض الغرفة', he: 'רוחב חדר' },
  'dim.edgeLength': { en: 'Edge', ar: 'الحافة', he: 'קצה' },
  'dim.boxWidth': { en: 'Width', ar: 'العرض', he: 'רוחב' },
  'dim.boxDepth': { en: 'Depth', ar: 'العمق', he: 'עומק' },
  'dim.boxHeight': { en: 'Height', ar: 'الارتفاع', he: 'גובה' },
};
