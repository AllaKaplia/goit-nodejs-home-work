const { HttpError } = require('../helpers');

const validateBodyFavorite = schema => {
    const fun = (req, res, next) => {
        const { error } = schema.validate(req.body);
  
        if (Object.keys(req.body).length === 0) {
            throw HttpError(400, 'Missing request favorite');
        } else if (error) {
            throw HttpError(400, error.message);
        }

        next();
    }

    return fun;
};

module.exports = validateBodyFavorite;