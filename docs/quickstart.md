

## Messaging Backend Nodes

Applications that require loading and broadcasting messages will need to connect to the messaging backend nodes.
The messaging backend nodes serve as verifies, storage spaces and relays for messages. 
In this way messages do not use hive RC yet still use hive posting key for signing and verification. 
Programmers can connect to a public node or start a new node and connect to it.

## Public Nodes

Public nodes support websocket connection via socket-io library. 

URL: https://chat-api.peakd.com

## Starting a node

To start an instance of a new node, clone the [backend repository on gitlab](https://gitlab.com/peakd/sting-message-backend/-/blob/progr-am7/apps/backend/README.md) .

### Install it with:
```
yarn
```

### Setup the Database:
Configure database connection with src/data-source.ts file,
which uses the following environemental variables for setup:

```
BASE_URL  default: 'http://localhost'
PORT      default: 3000
DB_TYPE   default: 'postgres', or 'sqlite'
DATABASE_URL default example: `postgres://postgres:test1234567@localhost:5432/test`
ACCOUNT   default: ''
NETNAME   default: 'main' example: 'main[account]', 'main[STM8945...]'
NODES     default: '' example: 'https://chat-api.peakd.com'
NODE_HOST default: 'localhost' example: '0.0.0.0'

```

NETNAME use 'main' as default or any other for testing purposes or for creating a node network
that will be separate from the main one. The NETNAME can also constain a comma separated list
of accounts or public keys which are used for validation of guest account creation requests.
NODES is a list of semicolon separated urls of seed nodes. To successfully connect, their netname
is to match the netname provided. To find a netname of a backend node you can retrieve the info via
`/api/info` endpoint, eg.: https://chat-api.peakd.com/api/info
ACCOUNT is hive account this node will authenticate as.

### Build the shared messaging library with:
```
yarn buildlib
```

### Postgres
Install postgress and set the DATABASE_URL,
The BASE_URL, PORT are to be set to the public website this api will be accessible from.

### SQLite [experimental]
Set DB_TYPE to 'sqlite' and DATABASE_URL to ':memory:' or file path, eg: 'dbfile.db'.

### Running the backend node

```
# watch and recompile on file changes, use SQLite in-memory DB, port 3001, no nodes
$ PORT=3001 DB_TYPE="sqlite" DATABASE_URL=":memory:" NODES="" yarn run start:watch
# use SQLite file database, port 3001, no nodes
$ PORT=3001 DB_TYPE="sqlite" DATABASE_URL="dbfile.db" yarn run start
# use Postgres database, port 3001, no nodes
$ PORT=3001 DATABASE_URL="postgres://postgres:test1234567@localhost:5432/test" yarn run start

```





