# Iskaribot.go

## Development

Iskaribot.go was built with Go 1.17.

### Run Iskaribot.go locally

1. Use `./go` as your working directory.
1. Get dependencies by running `go get`.
1. Add configuration data to the included `rename.env` file in the root folder, and rename the file to `.env`. Add it to the `./go` working directory. Optionally, and for production deployment, the configuration can be added as environment variables.
1. Run the bot with `go run iskaribot.go` which will start the built in http server and listen on the port configured in the environment variable PORT.
