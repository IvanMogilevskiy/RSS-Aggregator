export default (xmlString) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(xmlString, 'application/xml');
  const parsingError = data.querySelector('parsererror');
  if (parsingError) {
    throw new Error('parsingError');
  }

  const feed = {
    name: data.querySelector('channel > title').textContent,
    description: data.querySelector('channel > description').textContent,
  };

  const items = [...data.querySelectorAll('item')];
  const posts = items.map((item) => (
    {
      name: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    }
  ));

  return { feed, posts };
};
