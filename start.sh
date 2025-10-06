#!/bin/bash

# run migrations
npx drizzle-kit migrate

# Start
node server.js