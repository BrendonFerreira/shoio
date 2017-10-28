// const mysql = require('mysql')

// mysql.connect( 'kasjdkasjdkas' )
const query = function(){
    console.log( arguments )
}

const MINHAFUNCAOADAPTADORA = {
    async allFrom( fields, table, where ) {
        let where_result = [ ]
        for( let field_name in where ) {
            switch( typeof where[ field_name ] ){
                case "string":
                    where_result.push( `${field_name} = "${where[ field_name ]}"` )
                    break
                case "number":
                    where_result.push( `${field_name} = ${where[ field_name ]}` )   
                    break
                default: 
                    null
            }
        }

        return await query( "SELECT " + fields.join(',') + " FROM " + table + " WHERE " + where_result.join(" AND ") )
    }
}

