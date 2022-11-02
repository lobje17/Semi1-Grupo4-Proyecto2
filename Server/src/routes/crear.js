const { Router } = require('express');
const keys = require('../AWS/s3keys');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');
const s3 = new AWS.S3(keys.S3);
const functions = require('./password')
const database = require('../AWS/AWSKeys');
const crypto = require("crypto");

const rek = new AWS.Rekognition(keys.S3);
const cognito = new AmazonCognitoIdentity.CognitoUserPool(keys.cognito);
const translate = new AWS.Translate(keys.translate);
var label = "na";
var verificado = false;
const router = Router();
/*
{
    "BASE64" : "",
    "CONTENIDO" : "image/jpeg",
    "NOMBRE": "test (1).jpg"
}

*/
router.post('/Registro',async(req, res) => {    
    let {correo,contrasenia,fotoURL,nombreUsuario} = req.body
    var crypto = require('crypto');
    var hash = crypto.createHash('sha256').update(req.body.contrasenia).digest('hex');
    const connection  = database.Open();
    let query = `INSERT INTO Usuario 
        (nombreUsuario, correo,contrasenia,fotoperfil) VALUES (?, ? , ?, ?);`;

    ///======================================SigUp AWS ==========================================
    var attributelist = [];

    var dataname = {
        Name: 'custom:name',
        Value: nombreUsuario,
    };
    var attributename = new AmazonCognitoIdentity.CognitoUserAttribute(dataname);

    attributelist.push(attributename);

    var dataemail = {
        Name: 'email',
        Value: correo,
    };
    var attributeemail = new AmazonCognitoIdentity.CognitoUserAttribute(dataemail);

    attributelist.push(attributeemail);

    var datacarnet = {
        Name: 'custom:carnet',
        Value: nombreUsuario+"12",
    };
    var attributecarnet = new AmazonCognitoIdentity.CognitoUserAttribute(datacarnet);

    attributelist.push(attributecarnet);


    console.log(attributelist);

    cognito.signUp(nombreUsuario, hash+"D**", attributelist, null, async (err, data) => {

        if (err) {
            console.log(err);

            res.json(err.message || err);
            return;
        }
        console.log(data);
    });
    //============================================================================================
    //Subir foto
    let decodedImage = Buffer.from(fotoURL, 'base64');
    let bucket = 'semichat';
    let filepath = `Semi/admin_${nombreUsuario}.jpg`;
    let fotoaws = '';
    let uploadParamsS3 = {
      Bucket: bucket,
      Key: filepath,
      Body: decodedImage,
      ACL: 'public-read',
    };
    const uploadedImage = await s3.upload({
        Bucket: uploadParamsS3.Bucket,
        Key: uploadParamsS3.Key,
        Body: uploadParamsS3.Body,
        ACL: 'public-read'
      }).promise()
      fotoaws = uploadedImage.Location;
    // Value to be inserted
    connection.query(query, [nombreUsuario,
        correo,hash, fotoaws], (err, rows) => {
        if (err) throw err;
        console.log("Row inserted with id = "
            + rows.insertId);
        res.json({
            message: 'Usuario Ingresado Correctamente',
            status : '200',
            idUsuario : rows.insertId
        })
    });
});

//Login
router.post('/Login2',async(req, res) => {
    const connection  = database.Open();
    let {correo,contrasenia} = req.body
    var sql = 'SELECT Personid, nombreUsuario,correo, fotoperfil FROM Usuario WHERE contrasenia = ? and correo = ?';
    connection.query(sql, [contrasenia, correo], function (err, result) {
        if (result.length == 0){
            res.json({
                message: 'Usuario no se encuentra',
                status : '400'
            })
        }else{
            console.log(result);
            res.json({
                message: 'Usuario logeado Correctamente',
                data : result,
                status : '200'
            })
        }
})
});
//Upload Archivos
/*
{
    "BASE64" : "",
    "CONTENIDO" : "image/jpeg",
    "NOMBRE": "test (1).jpg",
    "PUBLICO" : 1,
    "IdUsuario" : 1
}

*/
router.post('/Publicacion',async(req, res) => {
    const connection  = database.Open();
    let {BASE64,CONTENIDO,NOMBRE,DESCRIPCION,IdUsuario} = req.body
    let query = `INSERT INTO Publicacion 
        (nombrePublicacion, Descripcion,URL,Personid,Label) VALUES (?, ? , ?, ?, ?);`;
    //Subir foto
    let decodedImage = Buffer.from(BASE64, 'base64');
    let bucket = 'semichat';
    let filepath = `Semi/${NOMBRE}`;
    let fotoaws = '';
    let uploadParamsS3 = {
      Bucket: bucket,
      Key: filepath,
      Body: decodedImage,
      ACL: 'public-read',
    };
    const uploadedImage = await s3.upload({
        Bucket: uploadParamsS3.Bucket,
        Key: uploadParamsS3.Key,
        Body: uploadParamsS3.Body,
        ACL: 'public-read',
        ContentType: CONTENIDO
      }).promise()
      fotoaws = uploadedImage.Location;

    /////Lable Rekogniton
    var params = {
        Image: {
            S3Object: {
                Bucket : 'semichat',
                Name: filepath
            },
        }
    }
    rek.detectLabels(params, function(err, data) {
        if (err) {
            console.log(err)
        }
        else {
            label = data.Labels[0].Name
            connection.query(query, [NOMBRE,
                DESCRIPCION,fotoaws, IdUsuario,label], (err, rows) => {
                if (err) throw err;
                console.log("Row inserted with id = "
                    + rows.insertId);
                res.json({
                    message: 'Archivo Subido Correctamente',
                    status : '200',
                    idArchivo : rows.insertId
                })
            });
        }
    });
    /////
});
//AgregarAmigo
/*
{
    "IdAmigoEmisor" : 1,
    "IdAmigoReceptor" : 2
}

*/
router.post('/AgregarAmigo',async(req, res) => {
    const connection  = database.Open();
    let {IdAmigoEmisor,IdAmigoReceptor} = req.body
    let query = `INSERT INTO Amigos 
        (idAmigoEmisor, idAmigoReceptor) VALUES (?, ? );`;
          // Value to be inserted
        connection.query(query, [IdAmigoEmisor,
            IdAmigoReceptor], (err, rows) => {
            if (err) throw err;
            console.log("Row inserted with id = "
                + rows.insertId);
            res.json({
                message: 'Amigo agregado Correctamente',
                status : '200'
            })
        });
});
//Obtener lista de todos los usuario
//Login
router.get('/Usuarios',async(req, res) => {
    const connection  = database.Open();
    var sql = 'SELECT u.Personid, u.nombreUsuario,u.correo, u.fotoperfil , IFNULL(sub.conteo, 0) as conteo\n' +
    '    FROM (select count(1) as conteo,a.personid\n' +
    '    from Archivo as a \n' +
    '    where a.isPublic = \'1\'\n' +
    '    group by a.Personid ) as sub\n' +
    '    right join Usuario as u on u.Personid = sub.personid';
    connection.query(sql, function (err, result) {
        if (result.length == 0){
            res.json({
                message: 'Usuario no se encuentra',
                status : '400'
            })
        }else{
            res.json({
                message: 'Listado de Usuarios',
                data : result,
                status : '200'
            })
        }
})
});
//Labels
router.post('/Labels',async(req, res) => {
    const connection  = database.Open();
    var sql = 'select Label as Item from Publicacion';
    connection.query(sql, function (err, result) {
        if (result.length == 0){
            res.json({
                message: 'Labels no se encuentra',
                status : '400'
            })
        }else{
            res.json({
                message: 'Listado de Labels',
                data : result,
                status : '200'
            })
        }
    })
});
//Login
router.post('/getPosts',async(req, res) => {
    const connection  = database.Open();
    var sql = 'select * from Publicacion';
    connection.query(sql, function (err, result) {
        if (result.length == 0){
            res.json({
                message: 'Post no se encuentra',
                status : '400'
            })
        }else{
            res.json({
                message: 'Listado de Post',
                data : result,
                status : '200'
            })
        }
    })
});

/*
Rekogniton
 */
// Analizar Emociones Cara
router.post('/detectarcara', function (req, res) {
    var imagen = req.body.imagen;
    /*var params = {
        Image: {
            Bytes: Buffer.from(imagen, 'base64')
        },
        Attributes: ['ALL']
    };*/
    var params = {
        Image: {
            S3Object: {
                Bucket : 'semichat',
                Name: 'Semi/admin_China.jpg'
            },
        }
    }
    rek.detectLabels(params, function(err, data) {
        if (err) {
            console.log(err)
            res.json({mensaje: "Error"})
        }
        else {
            res.json({Deteccion: data.Labels[0].Name});
        }
    });
});

//Cognito
//Amazon Cognito

router.post("/login", async (req, res) => {
    var crypto = require('crypto');
    var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    ////////////////////////////////////////////////////////////////////
    let idUsuario ;
    const connection  = database.Open();
    var sql = 'SELECT Personid, nombreUsuario,correo, fotoperfil FROM Usuario WHERE contrasenia = ? and nombreUsuario = ?';
    connection.query(sql, [ hash,  req.body.username], function (err, result2) {
        var authenticationData = {
            Username: req.body.username,
            Password: hash+"D**"
        };
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
            authenticationData
        );
        var userData = {
            Username: req.body.username,
            Pool: cognito,
        };
        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                // User authentication was successful
                res.json({result: result , dataUser : result2})
            },
            onFailure: function (err) {
                // User authentication was not successful
                res.json(err);
            },
            mfaRequired: function (codeDeliveryDetails) {
                // MFA is required to complete user authentication.
                // Get the code from user and call
                cognitoUser.sendMFACode(verificationCode, this);
            },
        });
    })
});

router.post("/api/signup", async (req, res) => {
    var attributelist = [];

    var dataname = {
        Name: 'custom:name',
        Value: req.body.name,
    };
    var attributename = new AmazonCognitoIdentity.CognitoUserAttribute(dataname);

    attributelist.push(attributename);

    var dataemail = {
        Name: 'email',
        Value: req.body.email,
    };
    var attributeemail = new AmazonCognitoIdentity.CognitoUserAttribute(dataemail);

    attributelist.push(attributeemail);

    var datacarnet = {
        Name: 'custom:carnet',
        Value: req.body.carnet+"",
    };
    var attributecarnet = new AmazonCognitoIdentity.CognitoUserAttribute(datacarnet);

    attributelist.push(attributecarnet);

    var crypto = require('crypto');
    var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    console.log(attributelist);

    cognito.signUp(req.body.username, hash+"D**", attributelist, null, async (err, data) => {

        if (err) {
            console.log(err);

            res.json(err.message || err);
            return;
        }
        console.log(data);
        res.json(req.body.username+' registrado');
    });
});

/*
Translate
 */

router.post('/translate1', (req, res) => {
    let body = req.body

    let text = body.text

    let params = {
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'es',
        Text: text || 'Hello there'
    };
    translate.translateText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            res.send({ error: err })
        } else {
            console.log(data);
            res.send({ message: data })
        }
    });
});
router.post('/translate2', (req, res) => {
    let body = req.body

    let text = body.text

    let params = {
        SourceLanguageCode: 'es',
        TargetLanguageCode: 'en',
        Text: text || 'Hello there'
    };
    translate.translateText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            res.send({ error: err })
        } else {
            console.log(data);
            res.send({ message: data })
        }
    });
});
router.post('/translate3', (req, res) => {
    let body = req.body

    let text = body.text

    let params = {
        SourceLanguageCode: 'es',
        TargetLanguageCode: 'fr',
        Text: text || 'Hello there'
    };
    translate.translateText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            res.send({ error: err })
        } else {
            console.log(data);
            res.send({ message: data })
        }
    });
});
module.exports = router;
