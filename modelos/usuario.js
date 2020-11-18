const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const usuarioSchema = new Schema({
    email: {type: String, unique: true, lowercase: true, required: true, trim: true},
    password: {type: String, required: true},
    nombre: {type: String, required: true}
},{
    timestamps: true, 
})

usuarioSchema.pre('save', function(next){
    const usuario = this;
    if(!usuario.isModified('password')){
        return next();
    }
    
    bcrypt.genSalt(saltRounds,(err,salt)=>{
        if(err){
           return next(err);
        }
        bcrypt.hash(usuario.password, salt, (err,hash)=> {
            if(err){
                next(err);
            }
            usuario.password = hash;
            next();
        })
    })
})

usuarioSchema.methods.compararPassword = function (password,callback){
    bcrypt.compare(password, this.password, (err, sonIguales) =>{
        if(err){
            return callback(err);
        } 
        return callback(null, sonIguales)
    })
}

module.exports = mongoose.model('Usuario', usuarioSchema)