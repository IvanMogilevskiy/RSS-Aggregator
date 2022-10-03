/* eslint-disable no-param-reassign, no-console  */

import i18next from 'i18next';
import axios from 'axios';
import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId.js';
import parse from './parser.js';
import ru from './locales/ru.js';
import validateUrl from './validateUrl.js';
import render from './view.js';
import updatePosts from './updatePosts.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.getElementById('modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalReadButton: document.querySelector('a.full-article'),
    modalCloseButton: document.querySelector('button.btn-secondary'),
  };

  const state = {
    form: {
      processState: 'filling',
      errors: '',
      url: '',
    },
    addedFeeds: [],
    posts: [],
    uiState: {
      viewedPosts: [],
      modal: '',
    },
  };

  const i18n = i18next.createInstance();
  i18n.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = onChange(state, render(state, elements, i18n));

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
        feed.link = value;
        posts.forEach((post) => {
          post.feedId = feed.id;
        });
        watchedState.addedFeeds = [feed, ...watchedState.addedFeeds];
        watchedState.posts = [...posts, ...watchedState.posts];
        watchedState.form.processState = 'added';
      })
      .catch((err) => {
        console.log(err);
        watchedState.form.processState = 'error';
        if (err.name === 'ValidationError') {
          watchedState.form.errors = err.message;
        }
        if (err.response) {
          watchedState.form.errors = i18n.t('errors.networkError');
        }
        if (err.message === 'parsingError') {
          watchedState.form.errors = i18n.t('errors.parsingError');
        }
      });
  });

  elements.postsContainer.addEventListener('click', (e) => {
    if (e.target.type === 'a') {
      watchedState.uiState.viewedPosts.push(e.target.dataset.id);
    }
    if (e.target.type === 'button') {
      watchedState.uiState.modal = e.target.dataset.id;
      watchedState.uiState.viewedPosts.push(e.target.dataset.id);
    }
  });

  setTimeout(() => updatePosts(watchedState), 5000);
};
