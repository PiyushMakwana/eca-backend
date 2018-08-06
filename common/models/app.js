
const jugglerUtils = require('loopback-datasource-juggler/lib/utils');
/**
 * Merge include options of default scope with runtime include option.
 * exhibits the _.extend behaviour. Property value of source overrides
 * property value of destination if property name collision occurs
 * @param {String|Array|Object} destination The default value of `include` option
 * @param {String|Array|Object} source The runtime value of `include` option
 * @returns {Object}
 */

// I will explain this code to you once we are able to talk sure
// remind me when we talk in the evening or sometime yep

module.exports = function(Model) {
  let app;

  Model.once('attached', (a) => {
    app = a;

    /** *************** REMOTE HOOK *************** **/

    Model.beforeRemote('find', (ctx, _, next) => {
      let currentFilter = ctx.args.filter || {};
      let includeRelations = {};
      Object.keys(Model.relations).forEach((related) => {
        // so I suggest, what you do is first read this code and also try to show all your data from the backend
        // dynamically
        includeRelations[related] = null;
      });
      // override current filter include
      if (currentFilter.include) {
        currentFilter.include =
          jugglerUtils.mergeIncludes(includeRelations, currentFilter.include);
      } else {
        currentFilter.include =
          jugglerUtils.mergeIncludes(includeRelations, currentFilter.include);
      }

      ctx.args.filter = currentFilter;
      /* istanbul ignore next */
      next();
    });

    /** ************* OPERATION HOOK ************* **/

    Model.observe('before save', (ctx, next) => {
      let userId = null;
      if (undefined !== ctx.options.accessToken) {
        userId = ctx.options.accessToken.userId;
      }
      ctx.hookState.relations = {};
      if (ctx.isNewInstance && ctx.instance) {
        Object.keys(Model.relations).forEach((related) => {
          ctx.hookState.relations[related] = ctx.instance [related]();
        });
      } else if (ctx.instance) {
        Object.keys(Model.relations).forEach((related) => {
          ctx.hookState.relations[related] = ctx.instance [related]();
        });
      }
      if (ctx.instance && ctx.instance.id) { 
        // if user modifies the data, i.e. updates the record, 
        // modifiedBy will be stored as the user who changes the record
        ctx.instance.modifiedBy = userId || ctx.instance.createdBy;
        ctx.instance.createdBy = ctx.instance.createdBy || userId;
        ctx.instance.modifiedAt = new Date();
      } else if (ctx.isNewInstance) {
        // createdBy is saved here
        ctx.instance.createdBy = userId || ctx.instance.createdBy;
        ctx.instance.createdAt = new Date();
      }
      /* istanbul ignore next */
      next();
    });

  });
}
