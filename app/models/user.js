var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

        username        : String,
        password     : String,
        details      : {
            college: String,
            degree: String
        }
});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.updateDetails = function (details) {
    this.details.college = details.college;
    this.details.degree = details.degree;
}

module.exports = mongoose.model('User', userSchema);