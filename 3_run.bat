@echo off

start cmd /k "cd server && npm start"
start cmd /k "cd client && npm start"

start http://localhost:3000