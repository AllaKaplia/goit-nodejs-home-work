const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require("jimp");

const { HttpError, contrWrapper } = require('../helpers');

const {SECRET_KEY} = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user) {
        throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});

    res.status(201).json({
        'user': {
            email: newUser.email,
            subscription: newUser.subscription
        }
    })
};

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, 'Email or password is wrong');
    };

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong');
    };

    const payload = {
        id: user.id,
    };

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});
    await User.findByIdAndUpdate(user._id, {token});


    res.status(200).json({
        token,
        'user': {
            email: user.email,
            subscription: user.subscription
        }
    })
};

const getCurrent = async (req, res) => {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    })
};

const logout = async (req, res) => {
    const {_id} = req.user;
    const result = await User.findByIdAndUpdate(_id, {token: ''});

    if(!result) {
        throw HttpError(404, 'Not found');
    }

    res.status(204).json({});
};

const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    const avatar = await Jimp.read(tempUpload);
    avatar.resize(250, 250).quality(80).write(resultUpload);

    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({
        avatarURL,
    });
};

module.exports = {
    register: contrWrapper(register),
    login: contrWrapper(login),
    getCurrent: contrWrapper(getCurrent),
    logout: contrWrapper(logout),
    updateAvatar: contrWrapper(updateAvatar),
};