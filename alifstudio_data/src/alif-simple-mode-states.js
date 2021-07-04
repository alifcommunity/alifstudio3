const tokens = [
  "ألف", "أضف", "مكتبة", "_س_", "مجال", "إرجاع", "نهاية", 
	"صنف", "خاص", "عدد", "نص", "كائن", "دالة", "هدم", "بناء",
	"كلما", "إذا", "أو", "و", "وإلا", "سطر" ,"صحيح", "خطأ", "كسر", "متغير", "ثابت", "منطق", "رئيسية"
];

export default {
  start: [
    { 
      regex: /_س_/, 
      token: "comment", 
      mode: { 
        spec: "clike", // lang-cpp ?
        end: /_س_/ 
      } 
    },
    // {
    //   regex: /دالة\s+.*/,
    //   token: "keyword",
    //   indent: true,
    //   sol: true
    // },
    // { regex: /[نهاية\s+(إذا|دالة)]/, token: "keyword", dedent: true },
    {
      regex: new RegExp(`(?:${tokens.join("|")})`),
      token: "keyword"
    },
    { 
      regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" 
    },
    { 
      regex: /خطأ|صحيح|عدد|منطق|نص/, token: "atom" },
    {
      regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
      token: "number"
    },
    {
      regex: /٠س[أبجدهو٠١٢٣٤٥٦٧٨٩]+|[-+]?(?:\.[٠١٢٣٤٥٦٧٨٩]+|[٠١٢٣٤٥٦٧٨٩]+\.?[٠١٢٣٤٥٦٧٨٩]*)(?:e[-+]?[٠١٢٣٤٥٦٧٨٩]+)?/i,
      token: "number"
    },
    { 
      regex: /--.*/, 
      token: "comment" 
    },
    { 
      regex: /#[\u0621-\u064A_]+/, 
      token: "header" 
    },
    { 
      regex: /\*|\+|-|\/|,|:|=/, 
      token: "operator" 
    },
    { 
      regex: /[_a-z\u0621-\u064A][\w\u0621-\u064A]+/i, 
      token: "variable" 
    }
  ],
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "--"
  }
}
