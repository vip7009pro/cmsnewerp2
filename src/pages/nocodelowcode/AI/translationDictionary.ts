import { generalQuery } from '../../../api/Api';

export type TranslationDictionaryLangKey = 'vi' | 'ko' | 'en' | 'cn';

export type TranslationDictionaryTerms = Partial<Record<TranslationDictionaryLangKey | string, string>>;

export type TranslationDictionaryEntry = {
  id: string;
  terms: TranslationDictionaryTerms;
  aliases: string[];
  note: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TranslationDictionaryStore = {
  version: number;
  updatedAt: string;
  count?: number;
  filePath?: string;
  items: TranslationDictionaryEntry[];
};

export type TranslationDictionaryPromptEntry = {
  id: string;
  source_lang: string;
  target_lang: string;
  source_term: string;
  target_term: string;
  matched_terms: string[];
  terms: TranslationDictionaryTerms;
  aliases: string[];
  note: string;
};

export type TranslationDictionaryFormValue = {
  id: string;
  vi: string;
  ko: string;
  en: string;
  cn: string;
  aliases: string;
  note: string;
  enabled: boolean;
};

type DictionaryCommandResponse = {
  tk_status?: string;
  message?: string;
  data?: {
    version?: number;
    updatedAt?: string;
    count?: number;
    filePath?: string;
    items?: TranslationDictionaryEntry[];
    results?: any[];
  };
};

const DICTIONARY_COMMANDS = {
  list: 'translation_dictionary_list',
  upsert: 'translation_dictionary_upsert',
  delete: 'translation_dictionary_delete',
  replaceAll: 'translation_dictionary_replace_all',
} as const;

const LANGUAGE_ALIAS_MAP: Record<TranslationDictionaryLangKey, string[]> = {
  vi: ['vi', 'vietnamese', 'vn', 'vie', 'tiếng việt'],
  ko: ['ko', 'korean', 'kr', 'hangul', 'hangul language'],
  en: ['en', 'english', 'us', 'uk'],
  cn: ['cn', 'zh', 'zh-cn', 'zh_hans', 'zh-hans', 'chinese', 'simplified chinese'],
};

const DEFAULT_LANG_LABELS: Record<TranslationDictionaryLangKey, string> = {
  vi: 'VI',
  ko: 'KO',
  en: 'EN',
  cn: 'CN',
};

const normalizeText = (value: unknown) => String(value ?? '').trim();

export const createEmptyTranslationDictionaryEntry = (): TranslationDictionaryFormValue => ({
  id: '',
  vi: '',
  ko: '',
  en: '',
  cn: '',
  aliases: '',
  note: '',
  enabled: true,
});

export const resolveDictionaryLangKey = (language: string): TranslationDictionaryLangKey | null => {
  const normalized = normalizeSearchText(language);
  if (!normalized) return null;

  for (const [key, aliases] of Object.entries(LANGUAGE_ALIAS_MAP) as Array<[TranslationDictionaryLangKey, string[]]>) {
    if (key === normalized) return key;
    if (aliases.some((alias) => normalizeSearchText(alias) === normalized)) return key;
  }

  return null;
};

export const resolveDictionaryLangLabel = (language: string): string => {
  const key = resolveDictionaryLangKey(language);
  return key ? DEFAULT_LANG_LABELS[key] : String(language || '').trim().toUpperCase();
};

export const normalizeSearchText = (value: unknown) => {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const unwrapDictionaryResponse = (response: any): DictionaryCommandResponse => {
  if (!response) return {};
  if (response?.data && typeof response.data === 'object' && 'tk_status' in response.data) {
    return response.data as DictionaryCommandResponse;
  }
  if ('tk_status' in response) {
    return response as DictionaryCommandResponse;
  }
  return {};
};

const ensureOk = (payload: DictionaryCommandResponse) => {
  if ((payload?.tk_status || '').toUpperCase() === 'NG') {
    throw new Error(payload?.message || 'Translation dictionary request failed');
  }
};

const normalizeEntry = (raw: any): TranslationDictionaryEntry => {
  const termsSource = raw?.terms && typeof raw.terms === 'object' ? raw.terms : raw || {};
  const aliasesSource = Array.isArray(raw?.aliases)
    ? raw.aliases
    : typeof raw?.aliases === 'string'
      ? raw.aliases.split(/[\n,;|]/g)
      : Array.isArray(raw?.user_terms)
        ? raw.user_terms
        : [];

  const terms: TranslationDictionaryTerms = {};
  for (const [key, value] of Object.entries(termsSource)) {
    if (['id', 'terms', 'aliases', 'note', 'description', 'desc', 'enabled', 'createdAt', 'updatedAt', 'created_at', 'updated_at'].includes(key)) {
      continue;
    }
    const text = normalizeText(value);
    if (text || value === '') {
      terms[key] = text;
    }
  }

  const result: TranslationDictionaryEntry = {
    id: normalizeText(raw?.id || raw?._id || raw?.key || raw?.name),
    terms,
    aliases: aliasesSource.map((item: unknown) => normalizeText(item)).filter(Boolean),
    note: normalizeText(raw?.note || raw?.description || raw?.desc),
    enabled: raw?.enabled === undefined ? true : Boolean(raw.enabled),
    createdAt: normalizeText(raw?.createdAt || raw?.created_at),
    updatedAt: normalizeText(raw?.updatedAt || raw?.updated_at),
  };

  for (const key of ['vi', 'ko', 'en', 'cn']) {
    if (Object.prototype.hasOwnProperty.call(termsSource, key)) {
      result.terms[key] = normalizeText(termsSource[key]);
    }
  }

  if (!result.id) {
    result.id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  return result;
};

export const createFormFromDictionaryEntry = (entry?: TranslationDictionaryEntry | null): TranslationDictionaryFormValue => {
  return {
    id: normalizeText(entry?.id),
    vi: normalizeText(entry?.terms?.vi),
    ko: normalizeText(entry?.terms?.ko),
    en: normalizeText(entry?.terms?.en),
    cn: normalizeText(entry?.terms?.cn),
    aliases: Array.isArray(entry?.aliases) ? entry.aliases.join(', ') : '',
    note: normalizeText(entry?.note),
    enabled: entry?.enabled !== false,
  };
};

export const createDictionaryEntryFromForm = (form: TranslationDictionaryFormValue): TranslationDictionaryEntry => {
  return normalizeEntry({
    id: form.id,
    terms: {
      vi: form.vi,
      ko: form.ko,
      en: form.en,
      cn: form.cn,
    },
    aliases: String(form.aliases || '')
      .split(/[\n,;|]/g)
      .map((item) => normalizeText(item))
      .filter(Boolean),
    note: form.note,
    enabled: form.enabled,
  });
};

export const loadTranslationDictionary = async (options?: {
  search?: string;
  includeDisabled?: boolean;
}): Promise<TranslationDictionaryStore> => {
  const response = await generalQuery(DICTIONARY_COMMANDS.list, {
    search: options?.search,
    includeDisabled: Boolean(options?.includeDisabled),
  });
  const payload = unwrapDictionaryResponse(response);
  ensureOk(payload);

  const data = payload.data || {};
  return {
    version: Number(data.version || 1),
    updatedAt: normalizeText(data.updatedAt),
    count: Number(data.count || 0),
    filePath: normalizeText(data.filePath),
    items: Array.isArray(data.items) ? data.items.map((item) => normalizeEntry(item)) : [],
  };
};

export const upsertTranslationDictionaryEntry = async (entry: TranslationDictionaryEntry) => {
  const response = await generalQuery(DICTIONARY_COMMANDS.upsert, {
    entry,
  });
  const payload = unwrapDictionaryResponse(response);
  ensureOk(payload);
  return payload.data || {};
};

export const replaceTranslationDictionaryEntries = async (entries: TranslationDictionaryEntry[]) => {
  const response = await generalQuery(DICTIONARY_COMMANDS.replaceAll, {
    entries,
  });
  const payload = unwrapDictionaryResponse(response);
  ensureOk(payload);
  return payload.data || {};
};

export const deleteTranslationDictionaryEntry = async (id: string) => {
  const response = await generalQuery(DICTIONARY_COMMANDS.delete, {
    id,
  });
  const payload = unwrapDictionaryResponse(response);
  ensureOk(payload);
  return payload.data || {};
};

const collectCorpusText = (items: Array<{ text?: string } | string>) => {
  return items
    .map((item) => (typeof item === 'string' ? item : String(item?.text ?? '')))
    .join('\n');
};

const matchesTerm = (corpus: string, term: string) => {
  const needle = normalizeSearchText(term);
  if (!needle) return false;
  return normalizeSearchText(corpus).includes(needle);
};

const getTermValues = (entry: TranslationDictionaryEntry) => {
  const terms = entry?.terms || {};
  return Object.entries(terms)
    .map(([key, value]) => ({ key, value: normalizeText(value) }))
    .filter((item) => item.value.length > 0);
};

export const findMatchingDictionaryEntries = (
  items: Array<{ text?: string } | string>,
  dictionary: TranslationDictionaryEntry[],
  fromLang: string,
  toLang: string,
) => {
  const corpus = collectCorpusText(items);
  const sourceKey = resolveDictionaryLangKey(fromLang);
  const targetKey = resolveDictionaryLangKey(toLang);
  const normalizedCorpus = normalizeSearchText(corpus);

  const matches: TranslationDictionaryPromptEntry[] = [];

  for (const entry of dictionary || []) {
    if (!entry || entry.enabled === false) continue;

    const termValues = getTermValues(entry);
    const matchedTerms: string[] = [];

    for (const { value } of termValues) {
      if (matchesTerm(normalizedCorpus, value)) matchedTerms.push(value);
    }
    for (const alias of entry.aliases || []) {
      if (matchesTerm(normalizedCorpus, alias)) matchedTerms.push(alias);
    }

    const uniqueMatchedTerms = Array.from(new Set(matchedTerms)).filter(Boolean);
    if (!uniqueMatchedTerms.length) continue;

    const sourceTerm = (sourceKey ? normalizeText(entry.terms?.[sourceKey]) : '')
      || uniqueMatchedTerms[0]
      || termValues[0]?.value
      || '';
    const targetTerm = (targetKey ? normalizeText(entry.terms?.[targetKey]) : '')
      || '';

    matches.push({
      id: entry.id,
      source_lang: sourceKey || normalizeSearchText(fromLang) || fromLang,
      target_lang: targetKey || normalizeSearchText(toLang) || toLang,
      source_term: sourceTerm,
      target_term: targetTerm,
      matched_terms: uniqueMatchedTerms,
      terms: { ...(entry.terms || {}) },
      aliases: Array.isArray(entry.aliases) ? [...entry.aliases] : [],
      note: entry.note || '',
    });
  }

  return matches;
};

export const buildDictionaryPromptBlock = (args: {
  items: Array<{ text?: string } | string>;
  dictionary: TranslationDictionaryEntry[];
  fromLang: string;
  toLang: string;
  docType?: string;
  maxEntries?: number;
}) => {
  const matches = findMatchingDictionaryEntries(args.items, args.dictionary, args.fromLang, args.toLang);
  if (!matches.length) return '';

  const maxEntries = Math.max(1, Math.floor(Number(args.maxEntries || 50)));
  const trimmedMatches = matches.slice(0, maxEntries);
  const sourceLabel = resolveDictionaryLangLabel(args.fromLang);
  const targetLabel = resolveDictionaryLangLabel(args.toLang);

  return [
    'Translation glossary priority rules:',
    `- The document type is ${args.docType || 'document'}.`,
    `- Source language: ${sourceLabel}. Target language: ${targetLabel}.`,
    '- If a segment contains any matched source term or alias below, use the target_term exactly and keep terminology consistent across the whole document.',
    '- Do not paraphrase glossary terms. Do not invent alternative translations for matched terms.',
    '- If multiple matched entries overlap, prefer the most specific term that appears in the text.',
    'Matched glossary entries (JSON):',
    JSON.stringify(trimmedMatches, null, 2),
  ]
    .filter(Boolean)
    .join('\n');
};

export const buildDictionaryPromptSuffix = buildDictionaryPromptBlock;
