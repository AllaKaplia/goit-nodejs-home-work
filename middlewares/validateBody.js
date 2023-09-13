const { HttpError } = require('../helpers');

const validateBody = schema => {
    const fun = (req, res, next) => {
        const { error } = schema.validate(req.body);
  
        if (Object.keys(req.body).length === 0) {
            throw HttpError(400, 'Missing request body');
        } else if (error) {
            throw HttpError(400, error.message);
        }

        next();
    }

    return fun;
}

module.exports = validateBody;