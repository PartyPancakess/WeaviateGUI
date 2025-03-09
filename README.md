# WeaviateGUI

WeaviateGUI is an interface to interact with the Weaviate Vector Database.

### Tools
Frontend: 
<a href="https://vite.dev/" target="blank">Vite</a>
+
<a href="https://vuejs.org/" target="blank">Vue3</a>
+
<a href="https://www.typescriptlang.org/" target="blank">TS</a>

Backend: <a href="http://nestjs.com/" target="blank">Nestjs</a>

## Get Started

### Docker

Use the below command to run it locally with docker.

```bash
docker run -d \
  -p 4173:4173 \
  -p 3000:3000 \
  -e WEAVIATE_HTTP_HOST=HOST \
  -e WEAVIATE_HTTP_PORT=8080 \
  -e WEAVIATE_API_KEY=KEY \
  partypancakes/weaviategui:latest
```
Connect with localhost:4173

### Locally (Dev)
Download the project files. <br />
In the directory of ViteFE, run: 
```
pnpm install
pnpm run dev
```
In the directory of weaviate-api, create a .env file and put the environment variables inside, then run:
```
pnpm install
pnpm run start 
or 
pnpm run start:dev
```

<br />

### Environment Variables
- WEAVIATE_HTTP_HOST: host of the Weaviate instance
- WEAVIATE_HTTP_PORT: port of the Weaviate instance
- WEAVIATE_GRPC_HOST: grpc host of the Weaviate instance if required for connection
- WEAVIATE_GRPC_PORT: grpc port
- WEAVIATE_API_KEY: Weaviate api key if set
- WEAVIATE_SKIP_INIT_CHECKS: Weaviate connection parameter (default true)
- WEAVIATE_SECURE: Weaviate connection parameter (http secure, default true)
- WEAVIATE_CONTAINER_NAME: if you are hosting Weaviate locally through docker, need to set this to Weaviate container name
- OPENAI_API_KEY: If you want to connect openai api to Weaviate (to allow Weaviate to generate vectors)

***All environment variables are optional. Use as needed.*** <br />
If WEAVIATE_HTTP_HOST is not given, or its value is 'localhost' or 'host.docker.internal', then connection is made local.

#### Some instructions on env. variables:
- If you are connecting to a custom (remote) weaviate instance, set the WEAVIATE_HTTP_HOST accordingly. 
- If you are running a weaviate instance locally with docker:
    - If you are running this project locally (not with docker), then use 'localhost' for WEAVIATE_HTTP_HOST. 
    - If you are running this project locally (with docker), use 'host.docker.internal' for WEAVIATE_HTTP_HOST. And set WEAVIATE_CONTAINER_NAME to the name of the running weaviate docker container's name. (Do not forget to add all the containers to the same docker network: docker network connect [network name] [container name])
        ```
        docker network create mynetwork
        docker network connect mynetwork weaviate

        docker run -d --network mynetwork \
        -p 4173:4173 \
        -p 3000:3000 \
        -e WEAVIATE_HTTP_HOST=host.docker.internal \
        -e WEAVIATE_HTTP_PORT=8080 \
        -e WEAVIATE_CONTAINER_NAME=weaviate \
        partypancakes/weaviategui:latest
        ```

<br />
<br />

## License
[MIT](https://choosealicense.com/licenses/mit/)

### Data Safety Disclaimer
The application may contain bugs or unforeseen issues that could lead to unintended data modification or loss. Users are advised to back up all critical data before using this tool. The developer of this software shall not be held liable for any direct, indirect, incidental, consequential, or any other kinds of damages arising from its use. Use this software at your own risk.
