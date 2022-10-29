const oracledb  = require('oracledb');
const db        = require('../config/settingdb');
/*
let dateFormat = require('dateformat');
let now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
 */

/* USADO PARA GUARDAR LOS CAMBIOS EN LA BD */
oracledb.autoCommit = true;
//const {add,getAll} = require('../controllers/usuario.controller')

const getPost = async (req, res) => 
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

const createPost = async (req, res) => 
{
    let now = new Date();
    let { picture, comment, tags, username } = req.body;
    let result ;
    /* PARA VERIFICAR A CONEXION */
    try
    {
        /* VERIFICACION DE LA EXIXTENCIA DE UN USUARIO CON EL MISMO USER NAME */
        sql =  `insert into publication(picture_publi, description, id_user, date_)
                select  :picture, 
                        :comment, 
                        u.id_user, 
                        :now
                from tuser u
                where u.username = :username`
        result = await db.Open(sql, [picture, comment, now, username], true);
        /* SI CONTIENE DATOS PARA EL TAG */
        if(tags!="")
        {   /* SE OBTINE UN LISTA DE TAGS */
            tags = tags.toLowerCase();
            tags = tags.replace(" ", "");
            let tag = tags.split('#');
            /* SE RECORRE LA LISTA DE TAGS */
            tag.forEach(t => {
                /* SE VERIFICA QUE NO EXISTA EL TAG */
                sql = `select id_tag from tag where name = :t`;
                result = await db.Open(sql, [t], false);
                /* SI NO CONTIENE DATOS SE INSERTA */
                if(result.rows.length == 0)
                {   /* SE INSERTA EL TAG */
                    sql =  `insert into tag(name) values(:t)`;               
                    result = await db.Open(sql, [t], true);
                    /* SE INSERTA EN EL LISTADO DE TAGS */
                    sql =  `insert into list_tag(id_publication, id_tag) 
                        select  p.id_publication, 
                                t.id_tag
                                from publication p, tag t, tuser u
                        where   p.picture_publi = :picture and
                                p.description = :comment and
                                p.id_user = u.id_user and
                                u.username = :username and
                                t.name = :t`;               
                    result = await db.Open(sql, [picture, comment, username, t], true); 
                }
            });
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

module.exports = {
    getPost,
    createPost
}