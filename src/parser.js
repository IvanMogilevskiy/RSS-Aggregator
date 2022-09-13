export default (xmlString) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(xmlString, 'application/xml');

  const output = {
    feed: {
      name: '',
      description: '',
      link: '',
    },
    posts: [],
  };

  const channelName = data.querySelector('channel > title');
  const channelDescription = data.querySelector('channel > description');
  const channelLink = data.querySelector('channel > link');

  const posts = data.querySelectorAll('post');

  output.feed.name = channelName.textContent;
  output.feed.description = channelDescription.textContent;
  output.feed.link = channelLink.textContent;

  posts.forEach((post) => {
    const itemName = post.querySelector('title');
    const itemDescription = post.querySelector('description');
    const itemLink = post.querySelector('link');

    output.posts.push({
      name: itemName.textContent,
      description: itemDescription.textContent,
      link: itemLink.textContent,
    });
  });

  return output;
};

// { feed: { name, description, link }, posts: [{ name, description, link }] }
