package main

import (
	"github.com/jobotron/kanban/data"
	"github.com/jobotron/kanban/server"
)

func main() {
	data.InitDB()
	server.Start()
}
