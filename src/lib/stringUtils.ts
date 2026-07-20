export type PrefixMap = {
  [key: string]: Prefix
}

export type Prefix = {
  prefix: string,
  subprefixes?: PrefixMap
}

export function generateFieldNames(
  map: PrefixMap,
  parentKey = '',
  parentPrefix = ''
) {
  const names: Record<string, string> = {};

  for (const [k, v] of Object.entries(map)) {
    const key = parentKey ? `${parentKey}${capitalize(k)}` : k;
    const prefix = parentPrefix ? `${parentPrefix}${v.prefix}:` : `${v.prefix}:`;

    names[key] = prefix;

    if (v.subprefixes) {
      const nested = generateFieldNames(v.subprefixes, key, prefix);
      Object.assign(names, nested);
    }
  }

  return names;
}

export function sortPrefixMapArray(array: [string, FormDataEntryValue][]) {
  const t: Record<string, any> = {}

  for (const v of array) {
    let current: Record<string, any> = t;

    const key = v[0]
    const val = v[1]

    const keyTree = key.split(':');
    for (const k of keyTree) {
      if (!current[k]) {
        let value = {};
        if (keyTree.indexOf(k) === keyTree.length - 1) value = val
        current[k] = value;
      }
      current = current[k];
    }
  }

  return t
}

export function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleCase(str: string) {
  if (!str) return "";
  return str
  .toLowerCase()
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
}

export function neutralizeString(str: string) {
  if (!str) return "";
  return str    
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

export function intComma(str: string) {
  if (!str) return "";
  let arr = str.split("").reverse().filter(a => a !== ',');
  let i = -1

  for (const c of arr) {
    i ++;
    if (i !== 0 && i < arr.length - 1 && (i + 1) % 3 === 0) {
      arr[i] = ',' + arr[i] 
    }
  }

  return(arr.reverse().join(''));
}

export function flattenObject(obj: Record<string, any>, prefix?: string): Record<string, any> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, key));
    } else {
      acc[key] = value;
    }

    return acc;
  }, {} as Record<string, any>);
};