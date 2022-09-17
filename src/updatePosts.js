/* eslint-disable no-param-reassign */
import _ from 'lodash';
import axios from 'axios';
import parse from './parser.js';

const updatePosts = (watchedState) => {
  if (watchedState.addedFeeds.length === 0) {
    setTimeout(() => updatePosts(watchedState), 5000);
    return;
  }
  const promises = watchedState.addedFeeds.map((addedFeed) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(addedFeed.link)}`));
  Promise.all(promises)
    .then((responses) => {
      responses.forEach((response) => {
        const { feed, posts } = parse(response.data.contents);
        const currentFeed = watchedState.addedFeeds
          .filter(({ name }) => feed.name.textContent === name.textContent);
        posts.forEach((post) => {
          post.feedId = currentFeed.id;
        });
        const newPosts = _.xor(watchedState.posts, posts);
        watchedState.posts = [...newPosts, ...watchedState.posts];
      });
    })
    .catch(console.error)
    .then(() => updatePosts(watchedState), 5000);
};

export default updatePosts;
