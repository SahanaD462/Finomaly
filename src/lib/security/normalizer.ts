// Unicode Homoglyph mapping to standard Latin ASCII
const HOMOGLYPHS: Record<string, string> = {
  // Cyrillic to Latin
  а: "a", А: "A",
  е: "e", Е: "E",
  о: "o", О: "O",
  р: "p", Р: "P",
  с: "c", С: "C",
  у: "y", У: "Y",
  х: "x", Х: "X",
  і: "i", І: "I",
  ј: "j", Ј: "J",
  ѕ: "s", Ѕ: "S",
  // Greek to Latin
  α: "a", Α: "A",
  β: "b", Β: "B",
  ε: "e", Ε: "E",
  ι: "i", Ι: "I",
  κ: "k", Κ: "K",
  ν: "v", Ν: "N",
  ο: "o", Ο: "O",
  ρ: "p", Ρ: "P",
  τ: "t", Τ: "T",
  // Fullwidth characters
  "ａ": "a", "ｂ": "b", "ｃ": "c", "ｄ": "d", "ｅ": "e",
  "ｆ": "f", "ｇ": "g", "ｈ": "h", "ｉ": "i", "ｊ": "j",
  "ｋ": "k", "ｌ": "l", "ｍ": "m", "ｎ": "n", "ｏ": "o",
  "ｐ": "p", "ｑ": "q", "ｒ": "r", "ｓ": "s", "ｔ": "t",
  "ｕ": "u", "ｖ": "v", "ｗ": "w", "ｘ": "x", "ｙ": "y",
  "ｚ": "z",
};

// Common Leetspeak replacements
const LEET_REPLACEMENTS: [RegExp, string][] = [
  [/1gn0re/gi, "ignore"],
  [/0verr1de/gi, "override"],
  [/5ud0/gi, "sudo"],
  [/adm1n/gi, "admin"],
  [/byp455/gi, "bypass"],
  [/5y5tem/gi, "system"],
  [/p455w0rd/gi, "password"],
  [/h4ck/gi, "hack"],
];

export interface NormalizationResult {
  original: string;
  normalized: string;
  obfuscationDetected: boolean;
  obfuscationTypes: string[];
  decodedPayloads: string[];
}

export function normalizeInput(input: string = ""): NormalizationResult {
  if (!input) {
    return {
      original: "",
      normalized: "",
      obfuscationDetected: false,
      obfuscationTypes: [],
      decodedPayloads: [],
    };
  }

  const detectedTypes: string[] = [];
  const decodedPayloads: string[] = [];
  let working = input;

  // 1. Detect and remove invisible / zero-width characters
  const zeroWidthRegex = /[\u200B-\u200D\uFEFF\u00A0\u2000-\u200A\u2028\u2029\u00AD]/g;
  if (zeroWidthRegex.test(working)) {
    detectedTypes.push("Zero-width / Invisible characters");
    working = working.replace(zeroWidthRegex, " ");
  }

  // 2. Homoglyph translation
  let homoglyphCount = 0;
  let homoglyphTranslated = "";
  for (const char of working) {
    if (HOMOGLYPHS[char]) {
      homoglyphTranslated += HOMOGLYPHS[char];
      homoglyphCount++;
    } else {
      homoglyphTranslated += char;
    }
  }
  if (homoglyphCount > 0) {
    detectedTypes.push(`Unicode homoglyphs detected (${homoglyphCount} characters substituted)`);
    working = homoglyphTranslated;
  }

  // 3. Detect and decode URL/Hex encoding patterns like %20, %27, \x61
  const hexUrlRegex = /(?:%[0-9a-fA-F]{2})+/g;
  const hexUrlMatches = working.match(hexUrlRegex);
  if (hexUrlMatches && hexUrlMatches.length > 0) {
    try {
      const decoded = decodeURIComponent(working);
      if (decoded !== working) {
        detectedTypes.push("URL/Hex encoded payload");
        decodedPayloads.push(`URL-decoded: ${decoded}`);
        working = decoded;
      }
    } catch {
      // malformed url encoding is itself suspicious
      detectedTypes.push("Malformed Hex/URL encoding sequence");
    }
  }

  // 4. Detect Base64 encoded strings
  // Pattern looking for potential base64 strings with reasonable length (at least 16 chars)
  const base64Regex = /(?:[A-Za-z0-9+/]{4}){4,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/g;
  const base64Matches = working.match(base64Regex);
  if (base64Matches) {
    for (const match of base64Matches) {
      try {
        // Try decoding
        const decoded = Buffer.from(match, "base64").toString("utf-8");
        // Check if printable ASCII/utf8
        const printableRatio = (decoded.match(/[\x20-\x7E\t\n\r]/g) || []).length / decoded.length;
        if (printableRatio > 0.85 && decoded.trim().length > 6) {
          detectedTypes.push(`Base64 encoded sequence: "${match.substring(0, 16)}..."`);
          decodedPayloads.push(`Base64-decoded: "${decoded}"`);
          // Append decoded text to working text to inspect its contents too
          working = `${working} [DECODED_B64: ${decoded}]`;
        }
      } catch {
        // Not valid base64
      }
    }
  }

  // 5. Normalize Leetspeak variants
  for (const [pattern, replacement] of LEET_REPLACEMENTS) {
    if (pattern.test(working)) {
      detectedTypes.push(`Leetspeak obfuscation for '${replacement}'`);
      working = working.replace(pattern, replacement);
    }
  }

  // 6. Normalize excessive spacing, line breaks, tabs
  const normalized = working
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    original: input,
    normalized,
    obfuscationDetected: detectedTypes.length > 0,
    obfuscationTypes: detectedTypes,
    decodedPayloads,
  };
}
