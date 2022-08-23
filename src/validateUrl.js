import * as yup from 'yup';

const validateUrl = (url, addedFeeds, i18n) => {
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
    .notOneOf(addedFeeds);

  return schema.validate(url);
};

export default validateUrl;
