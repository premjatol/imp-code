export function logoBasedOnFullName(first, last) {
  first = first?.trim() || "";
  last = last?.trim() || "";

  // Case 1: If last name exists → use first + last initials
  if (last) {
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  }

  // Case 2: Only first name provided
  const words = first.split(" ").filter(Boolean);

  if (words.length >= 2) {
    // Multi-word first name → pick first letter of first 2 words
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  if (words.length === 1) {
    // Single word → use first 2 letters
    return first.substring(0, 2).toUpperCase();
  }

  return "";
}
