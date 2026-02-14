import sanitizeHtml from 'sanitize-html'

export function sanitizeText(input: string) {
  return sanitizeHtml(input, {
    allowedTags: [],       // remove ALL html tags
    allowedAttributes: {}, // remove ALL attributes
    disallowedTagsMode: 'discard'
  }).trim()
}
