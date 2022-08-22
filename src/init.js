/* eslint-disable no-param-reassign, no-console  */

import onChange from 'on-change';
import validateUrl from './validateUrl.js';
import render from './view.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submitButton: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
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
  };

  const watchedState = onChange(state, render(elements));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const value = formData.get('url');

    validateUrl(value, watchedState.addedFeeds)
      .then((url) => {
        watchedState.form.url = url;
        watchedState.form.errors = '';
        watchedState.addedFeeds.push(url);
        watchedState.form.processState = 'adding';
      })
      .catch((err) => {
        watchedState.form.processState = 'error';
        watchedState.form.errors = err.message;
        watchedState.form.valid = false;
      });
  });
};
