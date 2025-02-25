# Gateway Flow UI

This repository is part of the [LoRaBridge](https://github.com/lorabridge2/lorabridge) project.
It provides the docker image for web interface used on our bridge device.

Our web interface is a self-provided SvelteKit web application that shows the ZigBee devices, which are retrieved via the SSE server. It enables you to disable unnecessary sensor attributes, in order to further reduce the transmitted data.

## Environment Variables

- `REDIS_HOST`: IP or hostname of Redis host
- `REDIS_PORT`: Port used by Redis
- `REDIS_DB`: Number of the database used inside Redis
- `NODE_ENV`: Nodejs Environement
- `PUBLIC_COUCHDB_USER`: User name for Couchdb
- `PUBLIC_COUCHDB_PASSWORD`: Password for Couchdb
- `PUBLIC_COUCHDB_PORT`: Port used by Couchdb
- `PUBLIC_COUCHDB_DB`: Name for database in Couchdb

## Local Development

```bash
npm run dev
# build production version with
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Docker Development

### build

```bash
docker build . -t flow_ui
```

### run

```bash
docker run --publish 3000:3000 -d --net="host" flow_ui <env vars>
```

## License

All the LoRaBridge software components and the documentation are licensed under GNU General Public License 3.0.

## Acknowledgements

The financial support from Internetstiftung/Netidee is gratefully acknowledged. The mission of Netidee is to support development of open-source tools for more accessible and versatile use of the Internet in Austria.
