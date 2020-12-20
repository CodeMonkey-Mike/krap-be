#!/bin/sh
DB_DEFAULT_NAME='krap_ps_df'
USER_DEFAULT_NAME='krap_ps_udf'
USER_DEFAULT_PWD='krappspwd'

auto() {
  if psql -lqt | cut -d \| -f 1 | grep -qw $DB_DEFAULT_NAME; then
    echo "The db $DB_DEFAULT_NAME already exists."
    exit
  else
    echo "CREATE USER $USER_DEFAULT_NAME WITH PASSWORD '$USER_DEFAULT_PWD'" | psql -U postgres -w
    echo "CREATE DATABASE $DB_DEFAULT_NAME ENCODING = 'UTF8';" | psql -U postgres -w
    echo "GRANT ALL PRIVILEGES ON DATABASE $DB_DEFAULT_NAME TO $USER_DEFAULT_NAME;" | psql -U postgres -w
    echo "REVOKE ALL PRIVILEGES ON DATABASE $DB_DEFAULT_NAME FROM public;" | psql -U postgres -w
    echo " Your database info:"
    echo "
      TYPEORM_DATABASE = $DB_DEFAULT_NAME
      TYPEORM_USERNAME = $USER_DEFAULT_NAME
      TYPEORM_PASSWORD = $USER_DEFAULT_PWD
      "
  fi
  
}

manual() { 
  # create the user
  echo What is username? your answer:
  read USER_NAME
  echo What is password? your answer:
  read USER_PWD
  if psql -t -c '\du' | cut -d \| -f 1 | grep -qw $USER_NAME; then
    # database exists
    # $? is 0
    echo "The user $USER_NAME already exists."
    echo "Do you want to create a new user [yes]/no"
    read YES_NO
    if [ $YES_NO == 'yes' ] || [ $YES_NO == 'y' ]; then
      echo Please give a new name:
      read USER_NAME_EL
      echo "CREATE USER $USER_NAME_EL WITH PASSWORD '$USER_PWD'" | psql -U postgres -w
    else
      # ruh-roh
      echo "Cancel create."
      exit
    fi
  else
      # ruh-roh
      # $? is 1
      echo "CREATE USER $USER_NAME WITH PASSWORD '$USER_PWD'" | psql -U postgres -w
  fi
   
  # create the DB
  echo What is your DB name? your answer:
  read DB_NAME
  if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    # database exists
    # $? is 0
    echo "The database $DB_NAME already exists."
    echo "Do you want to create with default db '$DB_DEFAULT_NAME'? [yes]/no"
    read YES_NO
    if [ $YES_NO == 'yes' ] || [ $YES_NO == 'y' ]; then
      echo "CREATE DATABASE $DB_DEFAULT_NAME ENCODING = 'UTF8';" | psql -U postgres -w
    else
      # ruh-roh
      echo "Please choose a another database name."
      exit
    fi
  else
      # ruh-roh
      # $? is 1
      echo "CREATE DATABASE $DB_NAME ENCODING = 'UTF8';" | psql -U postgres -w
  fi
  echo "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $USER_NAME;" | psql -U postgres -w
  echo "REVOKE ALL PRIVILEGES ON DATABASE $DB_NAME FROM public;" | psql -U postgres -w
  echo " Your database info:"
  echo "
    TYPEORM_DATABASE = $DB_NAME
    TYPEORM_USERNAME = $USER_NAME
    TYPEORM_PASSWORD = $USER_PWD
    "
}
# execute script
echo "Creating new user and database..."
IS_AUTO=$1
if [ $IS_AUTO == '-auto' ]; then
  auto
else
  manual
fi 