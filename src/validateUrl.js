import * as yup from 'yup';

const validateUrl = (url, urls) => {
  yup.setLocale({
    string: {
      url: ('errors.notUrl'),
    },
    mixed: {
      notOneOf: ('errors.notUnique'),
      required: ('errors.required'),
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
