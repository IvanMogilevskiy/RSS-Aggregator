/* eslint-disable no-param-reassign, no-console  */

import i18next from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId.js';
import parse from './parser.js';
import ru from './locales/ru.js';
import validateUrl from './validateUrl.js';
import { render, renderFeeds, renderPosts } from './view.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
  };

  const state = {
    form: {
      valid: true,
      processState: 'filling',
      processError: null,
      errors: '',
      url: '',
    },
    addedFeeds: [],
    posts: [],
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = onChange(state, render(elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    validateUrl(value, watchedState.addedFeeds, i18n)
      .then((url) => {
        watchedState.form.url = url;
        watchedState.form.errors = '';
        watchedState.form.processState = 'adding';

        return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);
      })
      .then((response) => {
        const { feed, posts } = parse(response.data.contents);
        feed.id = uniqueId();
        posts.forEach((item) => {
          item.feedId = feed.id;
        });
        watchedState.addedFeeds.push(feed);
        watchedState.posts.push(posts);
        renderFeeds(watchedState, elements);
        renderPosts(watchedState, elements);
        watchedState.form.processState = 'added';
      })
      .catch((err) => {
        console.log(err);
        watchedState.form.processState = 'error';
        watchedState.form.errors = err.message;
        watchedState.form.valid = false;
      });
  });
};
