module.exports = function(Model) {
  Model.validatesPresenceOf('mobileNumber');
  Model.validatesUniquenessOf('mobileNumber', {message: 'Mobile Number already exists'});
};