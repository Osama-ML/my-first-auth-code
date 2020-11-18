const passport = require('passport');
const Usuario = require('../modelos/usuario');

exports.postSingup = (req, res, next) => {
    const nuevoUsuario = new Usuario({
        email: req.body.email,
        nombre: req.body.nombre,
        password: req.body.password
    });


    Usuario.findOne({email: req.body.email}, (err, usuarioExiste)=>{
        if(usuarioExiste){
          return res.status(400).send('El email ya está registrado');
        }
        nuevoUsuario.save().then( () =>
          req.login(nuevoUsuario, (err) => {
            if(err){
              next(err);
            }
            res.send('Usuario creado correctamente');
          })
    ).catch(err=> console.log(err))
  })
}

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, usuario, info) => {
      if (err) {
        next(err);
      }
      if (!usuario) {
        return res.status(400).send('Email o contraseña no válidos');
      }
      req.login(usuario, (err) => {
        if (err) {
          next(err);
        }
        res.send('Login exitoso');
      })
    })(req, res, next);
  }

exports.logout = (req,res) => {
    req.logout();
    res.send('Logout exitoso')
}