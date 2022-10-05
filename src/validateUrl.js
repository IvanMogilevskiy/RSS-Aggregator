import * as yup from 'yup';

const validateUrl = (url, urls, i18n) => {
  yup.setLocale({
    string: {
      url: i18n.t('errors.notUrl'),
    },
    mixed: {
      notOneOf: i18n.t('errors.notUnique'),
    },
  });

  const schema = yup
    .string()
    .url()
    .required()
    .notOneOf(urls);

  return schema.validate(url);
};

export default validateUrl;
