export function seededShuffle(items, seedText = "marzalearn") {
  const result = [...items];
  let seed = 0;
  const text = String(seedText);

  for (let i = 0; i < text.length; i += 1) {
    seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
  }

  function random() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function countWords(text = "") {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function countSentences(text = "") {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const matches = trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  return matches?.filter((part) => part.trim().length > 0).length ?? 0;
}
