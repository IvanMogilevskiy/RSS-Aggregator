/* eslint-disable no-param-reassign, no-console  */
import isEmpty from 'lodash/isEmpty.js';

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'added':
      elements.submitButton.disabled = false;
      elements.input.readOnly = false;
      elements.feedback.textContent = 'RSS успешно загружен';
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

const handleProcessError = () => {
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

const render = (elements) => (path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      handleProcessState(elements, value);
      break;

    case 'form.processError':
      handleProcessError();
      break;

    case 'form.valid':
      // elements.submitButton.disabled = !value;
      break;

    case 'form.errors':
      renderErrors(elements, value, prevValue);
      break;

    default:
      break;
  }
};

export default render;
