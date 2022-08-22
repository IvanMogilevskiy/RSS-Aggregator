import * as yup from 'yup';

const validateUrl = (url, appliedUrls) => {
  const schema = yup
    .string()
    .url('Ссылка должна быть валидным URL')
    .required()
    .notOneOf(appliedUrls, 'RSS уже существует');

  return schema.validate(url);
};

export default validateUrl;
