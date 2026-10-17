package main

import (
	"kanban/data"
	"kanban/server"
)

func main() {
	data.InitDB()
	server.Start()
}
