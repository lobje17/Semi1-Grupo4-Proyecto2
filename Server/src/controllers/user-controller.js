const oracledb = require('oracledb');
const db = require('../config/settingdb');
const mulert = require('multer');
var sha1 = require('sha1');
/* USADO PARA GUARDAR LOS CAMBIOS EN LA BD */
oracledb.autoCommit = true;
//const {add,getAll} = require('../controllers/usuario.controller')

const getUsers = async (req, res) => 
{
    /* PARA VERIFICAR A CONEXION */
    try
    {
        sql = "select * from tuser";

        let result = await BD.Open(sql, [], false);
        Users = [];

        result.rows.map(user => {
        let userSchema = {
            "id":       user[0],
            "name":     user[1],
            "username": user[2]
        }

            Users.push(userSchema);
        })

        res.json(Users);
    } 
    catch (e) 
    {
        console.error(e)
        res.send({
            status: 400,
            data: e
        })
    }    
}

const login = async (req, res) => 
{
    let { username, password } = req.body;

    password = sha1(password);
    console.log("esto deberia esta encriptado   ", password);
    /* PARA VERIFICAR A CONEXION */
    try
    {
        sql =   `
                    BEGIN
                        Login(:username, :password);
                    END;
                `
        let result = await db.Open(sql, [username, password], false);
        /* VERIFICACION DE LA EXIXTENCIA DE UN USUARIO CON EL MISMO USER NAME Y PASSWORD */
        if (result.implicitResults[0].length>0) 
        {
            res.status(201).json({
                ok: true,
                info: 
                {
                    "id_user":  result.implicitResults[0][0][0],
                    "name":     result.implicitResults[0][0][1],
                    "username": result.implicitResults[0][0][2],
                    "password": result.implicitResults[0][0][3],
                    "bot_mode": result.implicitResults[0][0][4],
                    "picture":  result.implicitResults[0][0][5]
                }
            })
        }
        else
        {
            res.status(201).json({
                ok: false,
                info: 'Valor incorrecto en el nombre de usuario o la contraseña'
            })
        }
    } 
    catch (e) 
    {
        console.error(e)
        res.status(400).json({
            ok: false,
            info: e
        })
    }
}

const newAccount = async (req, res) => 
{
    let { name, username, password, picture } = req.body;

    password = sha1(password);
    console.log("esto deberia esta encriptado   ", password);
    let result ;
    /* PARA VERIFICAR A CONEXION */
    try
    {
        /* VERIFICACION DE LA EXIXTENCIA DE UN USUARIO CON EL MISMO USER NAME */
        sql = `
            BEGIN 
                NewUser(:name, :username, :password, :picture);
                COMMIT;
            END;
            `
        result = await db.Open(sql, [name, username, password, picture], true);

        sql = `select name from tuser where name = :name and username = :username and password = :password`;
        result = await db.Open(sql, [name, username, password], false);

        if(result.rows.length == 0)
        {
            res.send({
                status: 400,
                ok:     false,
                data:   "Ya existe un usuario con el username: "+username
            })
        }
        else
        {
            res.send({
                status: 200,
                ok:     true,
                data:   "Usuario creado con exito!!"
            })
        }
    } 
    catch (e) 
    {
        console.error(e)
        res.send({
            status: 400,
            data: e
        })
    }
}

const updateInfo = async (req, res) => 
{
    let { name, username, bot_mode, picture, password } = req.body;
    console.log("aqui   ",password);
    password = sha1(password);
    console.log("esto deberia esta encriptado update  ", password);
    /* PARA VERIFICAR A CONEXION */
    try
    {
        /* ACTUALIZACION DE LOS DATOS */
        sql =  `update tuser set name = :name, username = :username, bot_mode = :bot_mode, picture = :picture 
                where password = :password`;
        let result = await db.Open(sql, [name, username, bot_mode, picture, password], true);
        
        if(result.rowsAffected>0)
        {
            /* OBTENCION DE LOS NUEVOS DATOS */
            sql =  `select * from tuser where password = :password`;
            result = await db.Open(sql, [password], true);
            
            console.log(result);

            res.status(200).json({
                ok: true,
                info: "Datos actualizados correctamente!!",
                data:
                {
                    "id_user":  result.rows[0][0],
                    "name":     result.rows[0][1],
                    "username": result.rows[0][2],
                    "password": result.rows[0][3],
                    "bot_mode": result.rows[0][4],
                    "picture":  result.rows[0][5]
                }
            })
        }
        else
        {
            res.status(201).json({
                ok: false,
                info: "No se logro actualizar los datos!!",
                data:{}
            })
        }
    } 
    catch (e) 
    {
        console.error(e)
        res.send({
            status: 400,
            info: e,
            data:{}
        })
    }
}  

const storage = mulert.diskStorage({ 
    destination:function(req, file, cb){
        cb(null, './src/assets/public/')
    },
    filename:function(req, file, cb){
        cb(null, `${file.originalname}`)
    }
})

const upload = mulert({storage: storage}).single('myfile')
  

/************************************************************
*************************************************************
*************************************************************/
const getPosts = async (req, res) => 
{
    let { username } = req.body;
    let result ;
    /* PARA VERIFICAR A CONEXION */
    try
    {
        /* VERIFICACION DE LA EXIXTENCIA DE UN USUARIO CON EL MISMO USER NAME */
        sql =  `select u.username, u.picture, p.picture, p.coment
                from publication p, tuser u
                where   u.id_user = p.id_user and
                        u.username = :username
                order by p.id_publication DESC`
        result = await db.Open(sql, [username], false);

        Posts = [];
        let cadena = "";
    
        result.rows.map(post => {
            if(post[3]==null) cadena = "";
            else cadena = post[3];

            let postSchema = {
                "username": post[0],
                "pictureU": post[1],
                "pictureP":  post[2],
                "coment":   cadena,
                "tag":      ''
            }
            Posts.push(postSchema);
        })

        res.send({
                status: 200,
                ok:     true,
                data:   Posts
            })
    } 
    catch (e) 
    {
        console.error(e)
        res.send({
            status: 400,
            data: e
        })
    }
}

const createPost = async (req, res) => 
{
    let { picture, coment, tags, username } = req.body;
    console.log(coment);
    let result ;
    /* PARA VERIFICAR A CONEXION */
    try
    {
        /* VERIFICACION DE LA EXIXTENCIA DE UN USUARIO CON EL MISMO USER NAME */
        sql =  `insert into publication(picture, coment, id_user, date_)
                select  :picture, 
                        :coment, 
                        u.id_user, 
                        CURRENT_TIMESTAMP
                from tuser u
                where u.username = :username`
        result = await db.Open(sql, [picture, coment, username], true);

        /* SI CONTIENE DATOS PARA EL TAG */
        if(tags!="")
        {   
            /* SE OBTINE UN LISTA DE TAGS */
            tags = tags.toLowerCase();
            let tag = tags.split('#');

            let list = [];
            let n = 0;
            tag.forEach(el => {
                if(el!="") 
                {
                    list[n] = el;
                    n = n + 1;
                }
            }); 

            for (let i = 0; i < list.length; i++) 
            {
                let t = list[i];
                if(t!="")
                {
                    /* SE VERIFICA QUE NO EXISTA EL TAG */
                    sql = `select * from tag where name = :t`;
                    result = await db.Open(sql, [t], false);
                    
                    /* SI NO CONTIENE DATOS SE INSERTA */
                    if(result.rows == 0)
                    {   /* SE INSERTA EL TAG */
                        sql =  `insert into tag(name) values(:t)`;               
                        result = await db.Open(sql, [t], true);
                    }

                    /* SE INSERTA EN EL LISTADO DE TAGS */username
                    sql =  `insert into list_tag(id_publication, id_tag) 
                            select  p.id_publication, 
                                    t.id_tag
                            from publication p, tag t, tuser u
                            where   p.picture = :picture and
                                    p.id_user = u.id_user and
                                    u.username = :username and
                                    t.name = :t`;               
                            result = await db.Open(sql, [picture, username, t], true); 
                }
            }
        }
        res.send({
                status: 200,
                ok:     true,
                data:   "Publicacion creada correctamente"
            })
    } 
    catch (e) 
    {
        console.error(e)
        res.send({
            status: 400,
            data: e
        })
    }
}

const searchPost = async (req, res) => 
{
    let { username, tag } = req.body;
    let result ;
    /* PARA VERIFICAR A CONEXION */
    try
    {
        /* VERIFICACION DE LA EXIXTENCIA DE UN USUARIO CON EL MISMO USER NAME */
        sql =  `select u.username, u.picture, p.picture, p.coment, t.name
                from publication p, tuser u, tag t, list_tag l
                where   l.id_publication = p.id_publication and
                        l.id_tag = t.id_tag and
                        u.id_user = p.id_user and
                        u.username = :username and
                        t.name = :tag
                order by p.id_publication DESC`
        result = await db.Open(sql, [username, tag], false);
        console.log(result);
        Posts = [];
        let cadena = "";
    
        result.rows.map(post => {
            if(post[3]==null) cadena = "";
            else cadena = post[3];

            let postSchema = {
                "username": post[0],
                "pictureU": post[1],
                "pictureP": post[2],
                "coment":   cadena,
                "tag":      post[4]
            }
            Posts.push(postSchema);
        })

        if(result.rows.length>0)
        {
            res.send({
                status: 200,
                ok:     true,
                data:   Posts
            })
        }
        else{
            res.send({
                status: 201,
                ok:     false,
                data:   'No se encontraon coincidencias con el tag ' + tag
            })
        }
    } 
    catch (e) 
    {
        console.error(e)
        res.send({
            status: 400,
            data: e
        })
    }
}

module.exports = {
    getUsers,
    login,
    newAccount,
    updateInfo,
    upload,
    getPosts,
    createPost,
    searchPost
}