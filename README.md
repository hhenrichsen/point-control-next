# Point Control Next

Point Control Next allows you to run and join multiple IRL games with custom rules.

### Build

You will need to use pnpm. If you have never used it before run the following command:
`corepack enable`

Then run
```
pnpm install
pnpm run dev --parallel
```

Open a new terminal and run 
```
docker compose -f devops/docker-compose.yml -p hvz-gg up --build -d
pnpm run db:push
```

You should now be able to navigate to `localhost:3000` to view the app.

#### Viewing the Database

If you would like to easily view the database you can run `pnpm run db:studio`
If it doesn't automatically redirect you, open `localhost:5555` to see the database
