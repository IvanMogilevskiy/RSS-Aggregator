/* eslint-disable no-param-reassign */
import axios from 'axios';
import parse from './parser.js';

const updatePosts = (watchedState) => {
  if (watchedState.addedFeeds.length === 0) {
    setTimeout(() => updatePosts(watchedState), 5000);
    return;
  }
  const promises = watchedState.addedFeeds.map((addedFeed) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(addedFeed.link)}`)
    .then((response) => {
      const { posts } = parse(response.data.contents);
      const usedPostLinks = watchedState.posts.map(({ link }) => link);
      const newPosts = posts.filter(({ link }) => !usedPostLinks.includes(link));
      if (newPosts.length !== 0) {
        newPosts.forEach((post) => {
          post.feedId = addedFeed.id;
        });
        watchedState.posts = [...newPosts, ...watchedState.posts];
      }
    })
    .catch(console.error));
  Promise.all(promises)
    .then(() => setTimeout(() => updatePosts(watchedState), 5000));
};

export default updatePosts;
