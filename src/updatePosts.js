/* eslint-disable no-param-reassign */
import axios from 'axios';
import { uniqueId } from 'lodash';
import parse from './parser.js';
import makeProxyUrl from './makeProxyUrl.js';

const updatePosts = (watchedState) => {
  const promises = watchedState.addedFeeds
    .map((addedFeed) => axios.get(makeProxyUrl(addedFeed.link))
      .then((response) => {
        const { posts } = parse(response.data.contents);
        const usedPostLinks = watchedState.posts.map(({ link }) => link);
        const newPosts = posts.filter(({ link }) => !usedPostLinks.includes(link));
        if (newPosts.length !== 0) {
          newPosts.forEach((post) => {
            post.id = uniqueId();
            post.feedId = addedFeed.id;
          });
          watchedState.posts = [...newPosts, ...watchedState.posts];
        }
      })
      .catch(console.error));
  Promise.all(promises)
    .finally(() => setTimeout(() => updatePosts(watchedState), 5000));
};

export default updatePosts;
