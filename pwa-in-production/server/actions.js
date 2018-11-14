const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const validator = require('validatorjs');
const status = require('http-status');
const utils = require('./utils');

/* ====== Action definitions ====== */
const auth = {
  signIn: async (ctx) => {
    console.log(utils.nowUtc());
    console.log(utils.utcToLocal(utils.nowUtc()));
    let params = ctx.request.body;
    /* Post parameters validation */
    const rules = {
      email: 'required|email',
      password: 'required'
    };
    let validation = new validator(params, rules);
    if (validation.fails()) {
      return ctx.body = {
        code: status.BAD_REQUEST,
        errors: validation.errors.all(),
        message: ''
      };
    }
    /* Get corresponding user information */
    let user = await ctx.db('users').select('*').where({ email: params['email'] }).whereNull('deleted_at').first();
    if (!user || !bcrypt.compareSync(params['password'], user.password)) {
      return ctx.body = {
        code: status.UNAUTHORIZED,
        errors: {},
        message: 'The email or password is incorrect.'
      };
    }
    /* Return jwt signed with user's id token */
    let token = jsonwebtoken.sign({
      id: user.id
    }, utils.env('JWT_SECRET'), { expiresIn: '24h' });
    user.password = token;
    user.signed_in_at = utils.nowUtc();

    return ctx.body = {
      code: status.OK,
      errors: {},
      message: 'Signed in successfully.',
      data: { user }
    };
  },
  signUp: async (ctx) => {
    let params = ctx.request.body;
    /* Post parameters validation */
    const rules = {
      name: 'required',
      email: 'required|email',
      password: 'required'
    };
    let validation = new validator(params, rules);
    if (validation.fails()) {
      return ctx.body = {
        code: status.BAD_REQUEST,
        errors: validation.errors.all(),
        message: ''
      };
    }
    /* Get corresponding user information */
    let user = await ctx.db('users').select('*').where({ email: params['email'] }).first();
    if (user) {
      return ctx.body = {
        code: status.CONFLICT,
        errors: {},
        message: 'The email address is already in use.'
      };
    }
    try {
      let id = await ctx.db('users').insert({
        name: params.name,
        email: params.email,
        password: bcrypt.hashSync(params.password, 10),
        created_at: utils.nowUtc()
      }).returning('id');
      id = id[0];
      /* Return jwt signed with user's id token */
      let token = jsonwebtoken.sign({
        id: id
      }, utils.env('JWT_SECRET'), { expiresIn: '24h' });
      user = await ctx.db('users').select('*').where({ id: id }).first();
      user.password = token;
      user.signed_in_at = utils.nowUtc();

      return ctx.body = {
        code: status.OK,
        errors: {},
        message: 'Signed up successfully.',
        data: { user }
      };
    } catch (e) {
      return ctx.body = {
        code: status.INTERNAL_SERVER_ERROR,
        errors: {},
        message: e.message
      };
    }
  },
  signOut: async (ctx) => {
    return ctx.body = {
      code: status.OK,
      errors: {},
      message: 'Signed out successfully.',
      data: {}
    };
  }
};

const cryptocurrencies = {
  index: async (ctx) => {
    let cryptocurrencies = await ctx.db('cryptocurrencies').select('*').whereNull('deleted_at');
    ctx.status = 200;
    ctx.body = {
      code: status.OK,
      errors: {},
      message: '',
      data: {
        cryptocurrencies
      }
    };
  },
  show: async (ctx) => {
    let id = ctx.params.id;
    let cryptocurrency = await ctx.db('cryptocurrencies').select('*').where({ id: id }).whereNull('deleted_at').first();
    ctx.status = 200;
    ctx.body = {
      code: status.OK,
      errors: {},
      message: '',
      data: {
        cryptocurrency
      }
    };
  }
};

module.exports = {
  auth,
  cryptocurrencies
};
