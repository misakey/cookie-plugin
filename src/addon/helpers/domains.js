export function getMainDomainWithoutPrefix(domain) {
  if (domain.startsWith('www.')) {
    return domain.replace('www.', '');
  }
  return domain;
}
