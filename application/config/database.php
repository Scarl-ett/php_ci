<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------
| DATABASE CONNECTIVITY SETTINGS
| -------------------------------------------------------------------
| This file will contain the settings needed to access your database.
|
| For complete instructions please consult the 'Database Connection'
| page of the User Guide.
|
| -------------------------------------------------------------------
| EXPLANATION OF VARIABLES
| -------------------------------------------------------------------
|
|    ['hostname'] The hostname of your database server.
|    ['username'] The username used to connect to the database
|    ['password'] The password used to connect to the database
|    ['database'] The name of the database you want to connect to
|    ['dbdriver'] The database type. ie: mysql.  Currently supported:
                 mysql, mysqli, postgre, odbc, mssql, sqlite, oci8
|    ['dbprefix'] You can add an optional prefix, which will be added
|                 to the table name when using the  Active Record class
|    ['pconnect'] TRUE/FALSE - Whether to use a persistent connection
|    ['db_debug'] TRUE/FALSE - Whether database errors should be displayed.
|    ['cache_on'] TRUE/FALSE - Enables/disables query caching
|    ['cachedir'] The path to the folder where cache files should be stored
|    ['char_set'] The character set used in communicating with the database
|    ['dbcollat'] The character collation used in communicating with the database
|                 NOTE: For MySQL and MySQLi databases, this setting is only used
|                  as a backup if your server is running PHP < 5.2.3 or MySQL < 5.0.7
|                 (and in table creation queries made with DB Forge).
|                  There is an incompatibility in PHP with mysql_real_escape_string() which
|                  can make your site vulnerable to SQL injection if you are using a
|                  multi-byte character set and are running versions lower than these.
|                  Sites using Latin-1 or UTF-8 database character set and collation are unaffected.
|    ['swap_pre'] A default table prefix that should be swapped with the dbprefix
|    ['autoinit'] Whether or not to automatically initialize the database.
|    ['stricton'] TRUE/FALSE - forces 'Strict Mode' connections
|                            - good for ensuring strict SQL while developing
|
| The $active_group variable lets you choose which connection group to
| make active.  By default there is only one group (the 'default' group).
|
| The $active_record variables lets you determine whether or not to load
| the active record class
*/

$active_group = '';
$active_record = TRUE;

//web 서버 DB mapping
$web_db_link = array(

    "114.203.87.164"=> array("DB_2","DB_2"),                //web1
    "114.203.87.167"=> array("DB_1","DB_1"),                //web2
    "114.203.87.229"=> array("DB_3","DB_3"),                //web3
    "175.115.53.163"=> array("DB_1","DB_1")                 //web4
);

//DB 정보
$db_info = array(
    'DB_TEST'           => "114.203.87.165",
);

$user_info = array(

    /**
     *  청취 Test DB
     */
    'USER_TEST' => array(
        'username' => 'cw_user',
        'password' => 'chdnjsdbwj',
        'database' => 'cw_db'
    ),
);


$db['default']['hostname'] = '';
$db['default']['username'] = '';
$db['default']['password'] = '';
$db['default']['database'] = '';
$db['default']['dbdriver'] = 'mysql';
$db['default']['dbprefix'] = '';
$db['default']['pconnect'] = FALSE;
$db['default']['db_debug'] = TRUE;
$db['default']['cache_on'] = FALSE;
$db['default']['cachedir'] = APPPATH.'cache/_dbcache/chungchy';
$db['default']['char_set'] = 'euckr';
$db['default']['dbcollat'] = 'euckr_korean_ci';
$db['default']['swap_pre'] = '';
$db['default']['autoinit'] = TRUE;
$db['default']['stricton'] = FALSE;

$db['cw']['hostname'] = 'cw.test.com';
$db['cw']['username'] = 'cw_user';
$db['cw']['password'] = 'chdnjsdbwj';
$db['cw']['database'] = 'cw_db';
$db['cw']['dbdriver'] = 'mysql';
$db['cw']['dbprefix'] = '';
$db['cw']['pconnect'] = FALSE;
$db['cw']['db_debug'] = FALSE;
$db['cw']['cache_on'] = FALSE;
$db['cw']['cachedir'] = APPPATH.'cache/_dbcache/chungchy';
$db['cw']['char_set'] = 'euckr';
$db['cw']['dbcollat'] = 'euckr_korean_ci';
$db['cw']['swap_pre'] = '';
$db['cw']['autoinit'] = TRUE;
$db['cw']['stricton'] = FALSE;
/* End of file database.php */
/* Location: ./application/config/database.php */