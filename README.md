# Main Script

| Npm Script   | Description                                 |
| ------------ | ------------------------------------------- |
| `check`      | lint + prettier checks                      |
| `fix`        | lint + prettier fix                         |
| `Build`      | Build distribution JS                       |
| `test`       | Run all test                                |
| `test:watch` | Run test in watch mode                      |
| `dev`        | Run dev environment with debugger listening |
| `start`      | Run build js programas                      |

## Attach debugger

When runing in dev mode, we can attach the debugger from debbug section. Dev script, is executed with `--inspect` flag that will open a websocket for listening a debbugger connection.

# Environment variables (.env)

`NODE_ENV="development"`

`PORT=`

DB without docker - sudo systemctl start mongod

`MONGODB_URI="mongodb://localhost:27017/tutorial"`

DB with docker - docker-compose build / docker-compose up

`MONGODB_URI="mongodb://mongodb:27017/tutorial"`

- Generate new keys: https://travistidwell.com/jsencrypt/demo/
- Base64 encode the keys: https://www.base64encode.org/

JWT ACCESS PUBLIC/PRIVATE KEY

`ACCESS_TOKEN_PRIVATE_KEY=""`

`ACCESS_TOKEN_PUBLIC_KEY=""`

JWT REFRESH PUBLIC/PRIVATE KEY

`REFRESH_TOKEN_PRIVATE_KEY=""`

`REFRESH_TOKEN_PUBLIC_KEY=""`

EXAMPLE ACCOUNT EMAIL

`SMTP_HOST="smtp.ethereal.email"`

`SMTP_PORT=587`

`SMTP_SECURE=false`

`SMTP_USERNAME="zgadbajztc64cp2q@ethereal.email"`

`SMTP_PASSWORD="eB28yyPzZmg4nMyYkq"`

`EMAIL_FROM="from@email.com"`
