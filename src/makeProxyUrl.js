const makeProxyUrl = (url) => {
  const proxyUrl = new URL('/get', 'https://allorigins.hexlet.app');
  proxyUrl.searchParams.set('disableCache', 'true');
  proxyUrl.searchParams.set('url', encodeURI(url));

  return proxyUrl.toString();
};

export default makeProxyUrl;
