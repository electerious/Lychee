### Installation using Docker

*Note: pre-installation of the latest version of [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Docker](https://docs.docker.com/installation/) is required to deploy Lychee using Docker.*

First, clone the latest version of Lychee and build it using the Dockerfile included in the repository.

```bash
git clone https://github.com/electerious/Lychee.git
cd Lychee
docker build -t lychee .
```

Once this is finished, remember to set the proper permissions on the `uploads` and `data` directories, so the container can mount these directories as volumes.

```
chmod -R 777 uploads/ data/
```

Now you can use the `docker run` command to run your Lychee container.

```bash
docker run -v /var/lib/mysql --name lychee_data \
           -v $(pwd)/data:/app/data \
           -v $(pwd)/uploads:/app/uploads \
           -i -t -d -p 8000:80 lychee
```

Browse to [localhost:8000](http://localhost:8000/) (the port can be specified via the `-p` flag) and you will see Lychee's configuration page. The default database username is `root` with no password (you can manage MySQL users by running `docker exec -i -t <container_id> mysql`). After submitting your database configuration, you can sign in and create a new username and password and start using Lychee.   

*Note: if you are deploying on a server, you might want to forward your container to port `80` instead of `8000` so it'll be publicly accessible.*

### Managing Data

Running the container with the options above mounts three Docker [data volumes](https://docs.docker.com/userguide/dockervolumes/). The first is a named "data" volume used to store the MySQL database. The last two will mount the `/data` and `/uploads` from the container to your host `Lychee` directory. If you would like to upgrade or redeploy Lychee while preserving your data, you can kill the container and the volumes will persist. Just rebuild your new container and run it using a similar command:

```bash
sudo docker run --volumes-from lychee_data \
                -v $(pwd)/data:/app/data \
                -v $(pwd)/uploads:/app/uploads \
                -i -t -d -p 8000:80 lychee
```