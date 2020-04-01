import PropTypes from 'prop-types';

const RequestsSchema = {
  name: PropTypes.string,
  mainDomain: PropTypes.string,
  blocked: PropTypes.bool,
};

export default RequestsSchema;
