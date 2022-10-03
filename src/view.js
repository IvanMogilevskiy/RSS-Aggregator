/* eslint-disable no-param-reassign, no-console  */

const handleProcessState = (elements, processState, i18n) => {
  switch (processState) {
    case 'added':
      elements.submitButton.disabled = false;
      elements.input.readOnly = false;
      elements.feedback.classList.replace('text-danger', 'text-success');
      elements.feedback.textContent = i18n.t('processState.added');
      elements.form.reset();
      elements.form.focus();
      break;

    case 'error':
      elements.submitButton.disabled = false;
      elements.input.readOnly = false;
      break;

    case 'adding':
      elements.submitButton.disabled = true;
      elements.input.readOnly = true;
      break;

    case 'filling':
      elements.submitButton.disabled = false;
      elements.input.readOnly = false;
      break;

    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

const renderErrors = (elements, error, prevError) => {
  const hadError = (prevError !== '');
  const hasError = (error !== '');

  if (!hadError && !hasError) {
    return;
  }

  if (hadError && !hasError) {
    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.replace('text-danger', 'text-success');
    elements.feedback.textContent = '';
    return;
  }

  if (hadError && hasError) {
    elements.feedback.textContent = error;
    return;
  }

  elements.input.classList.add('is-invalid');
  elements.feedback.classList.add('text-danger');
  elements.feedback.textContent = error;
};

const renderFeeds = (watchedState, elements, i18n) => {
  elements.feedsContainer.innerHTML = '';

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('feeds.title');

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  cardBody.append(cardTitle);
  cardBorder.append(cardBody);
  cardBorder.append(feedsList);
  elements.feedsContainer.append(cardBorder);

  watchedState.addedFeeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.name;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    li.append(h3);
    li.append(p);
    feedsList.append(li);
  });
};

const renderPosts = (watchedState, elements, i18n) => {
  elements.postsContainer.innerHTML = '';

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');
  elements.postsContainer.append(cardBorder);

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  cardBorder.append(cardBody);

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18n.t('posts.title');
  cardBody.append(cardTitle);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  cardBorder.append(postsList);

  watchedState.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    postsList.append(li);

    const postName = document.createElement('a');
    postName.setAttribute('href', post.link);

    const linkClass = watchedState.uiState.viewedPosts.includes(post.id) ? ('fw-normal', 'link-secondary') : ('fw-bold');

    postName.classList.add(linkClass);
    postName.dataset.id = post.id;
    postName.setAttribute('target', '_blank');
    postName.setAttribute('rel', 'noopener noreferrer');
    postName.textContent = post.name;
    li.append(postName);

    const watchButton = document.createElement('button');
    watchButton.setAttribute('type', 'button');
    watchButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    watchButton.dataset.id = post.id;
    watchButton.dataset.bsToggle = 'modal';
    watchButton.dataset.bsTarget = '#modal';
    watchButton.textContent = i18n.t('posts.watchButton');
    li.append(watchButton);
  });
};

const renderModal = (watchedState, elements, postId, i18n) => {
  const [chosenPost] = watchedState.posts.filter((post) => post.id === postId);

  elements.modalTitle.textContent = chosenPost.name;
  elements.modalBody.textContent = chosenPost.description;
  elements.modalReadButton.setAttribute('href', chosenPost.link);
  elements.modalReadButton.textContent = i18n.t('modal.readButton');
  elements.modalCloseButton.textContent = i18n.t('modal.closeButton');
};

const render = (watchedState, elements, i18n) => (path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value, i18n);
      break;

    case 'form.errors':
      renderErrors(elements, value, prevValue);
      break;

    case 'posts':
      renderPosts(watchedState, elements, i18n);
      break;

    case 'addedFeeds':
      renderFeeds(watchedState, elements, i18n);
      break;

    case 'uiState.modal':
      renderModal(watchedState, elements, value, i18n);
      break;

    case 'uiState.viewedPosts':
      renderPosts(watchedState, elements, i18n);
      break;

    default:
      break;
  }
};

export default render;
