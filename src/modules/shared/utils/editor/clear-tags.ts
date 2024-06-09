
export const clearTagsWithExclusions = (v: string, tags: string[] = []) => {
  if (v && typeof v === 'string') {
    const regex = tags && tags.length ? new RegExp(`(<(?!${tags.join('|')})([^>]+)>)`, 'ig') : /(<([^>]+)>)/ig
    return v.replace(regex, '')
  } else {
    return v
  }
}
