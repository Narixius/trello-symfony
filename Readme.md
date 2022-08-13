# Trello clone based on Symfony

Stack
- PHP 8.1
- Symfony 6
- MySQL
- Inertiajs
- Nginx
- Docker
- React
- Tailwind

Cloned from https://github.com/ger86/symfony-docker

## Getting started

#### TLDR
Backend
```bash
echo "NGINX_BACKEND_DOMAIN='localhost'" > "./.docker/.env.nginx.local"
cd ./.docker
docker-sync-stack start
```
Frontend
```bash
yarn dev-server
```

### Details

#### Backend

1. Create the file `./.docker/.env.nginx.local` using `./.docker/.env.nginx` as template. The value of the variable `NGINX_BACKEND_DOMAIN` is the `server_name` used in NGINX.

2. Go inside folder `./docker` and run `docker-sync-stack start` to start containers.

3. You should work inside the `php` container. This project is configured to work with [Remote Container](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension for Visual Studio Code, so you could run `Reopen in container` command after open the project.

4. Inside the `php` container, run `composer install` to install dependencies from `/var/www/symfony` folder.

5. Use the following value for the DATABASE_URL environment variable:

```
DATABASE_URL=mysql://app_user:helloworld@db:3306/app_db?serverVersion=8.0.23
```

You could change the name, user and password of the database in the `env` file at the root of the project.

#### Frontend

The frontend is implemented by React, don't forget ro run the dev-server

```bash
yarn dev-server
```

## To learn more

Check the main [repository](https://github.com/ger86/symfony-docker)
