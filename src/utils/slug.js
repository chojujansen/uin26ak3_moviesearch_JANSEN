export function toSlug(title) {
  return encodeURIComponent(
    title
      .toLowerCase()
      .trim()
      .replace(/['"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  );
}

export function fromSlug(slug) {
  return decodeURIComponent(slug).replace(/-/g, ' ').trim();
}
