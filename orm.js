// const mysql = require('mysql')

// mysql.connect( ' ' )

const where_object_to_query = ( where ) => {

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
  return where_result
}

const query = function(){
    console.log( arguments )
}


    async function allFrom( fields, table, where ) {
        let query_stack = []

        query_stack.push( 'SELECT' )

        if( fields.length > 0 ) {
          query_stack.push( fields.join( ', ' ) )
        } else {
          query_stack.push( ' * ' )
        }

        query_stack.push( 'FROM' )

        if( table instanceof Array ) {
          query_stack.push( table.join( ', ' ) )
        } else {
          query_stack.push( table )
        }

        if( where && Object.keys( where ) > 0 ) {
          query_stack.push( 'WHERE' )
          query_stack.push( where_object_to_query( where ).join( " AND " ) )
        }

        query_stack.push( ';' )
        
        return await query( query_stack.join(' ') )
    }


    async function insertInto( table, data ) {
        let data_result = [ ]
        for( let data_insert in data ) {
            switch( typeof data[ data_insert ] ){
                case "string":
                    data_result.push( `"${data[ data_insert ]}"` )
                    break
                case "number":
                    data_result.push( `${data[ data_insert ]}` )
                    break
                default:
                    null
            }
        return await query( "INSERT INTO " + table + " VALUES( " + data_result.join( ", " ) + " );")
        }
    }

    //a deleção é de apenas um só item para evitar problemas, afinal no BD não existe ctrl+z
    async function deleteFrom( table, column, value ) {
        let value_result = [ ]
        switch( typeof value[ value_result ] ){
            case "string":
                value_result.push( `"${value[ value_result ]}"` )
                break
            case "number":
                value_result.push( `${value[ value_result ]}` )
                break
            default:
                null
        }
        return await query( "DELETE FROM " + table + " WHERE " + column + " = " + value_result + ";")
    }


    //update de apenas um campo
    async function updateTable( table, column, value ){
        let value_result = [ ]
        switch( typeof value[ value_result ] ){
            case "string":
                value_result.push( `"${value[ value_result ]}"` )
                break
            case "number":
                value_result.push( `${value[ value_result ]}` )
                break
            default:
                null
        }
        return await query( "UPDATE " + table + " SET " + column + " = " + value + " WHERE " + column + " = " + value_result + ";")
    }

    //Em andamento: CREATE TABLE com verificação de PK e FK nas inserções para evitar o uso do ALTER TABLE nesses casos
    //Dessa forma se quiser inserir uma chave primária ou estrangeira basta colocar 'PK' ou 'FK' no nome da coluna
    async function createTable( table, column_data, ref_table, ref_column ){
        let column_result = [ ]
        let reference_result = [ ]
        for( let column_insert in column_data ){
            column_result.push( `"${column_data[ column_result ]}"` )
            if( column_data.match(/PK/) ){
                column_result.push( `"PRIMARY KEY (${column_data[ column_result ]})"` )
            } else if ( column_data.match(/FK/) && ref_table ){
                for( let reference_insert in reference_result ){
                    reference_result.push( `"FOREIGN KEY (${column_data[ column_result ]}) REFERENCES ${ref_table}(ref_column)"` )
                }
            }
        }
        return await query( "CREATE TABLE " + table + " ( " + column_result.join(" , ") + reference_result + " );" )
    }
