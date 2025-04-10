package data

import (
	"database/sql"
	"github.com/jobotron/kanban/dto"
	_ "github.com/mattn/go-sqlite3"
	"log"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", ":memory:")
	if err != nil {
		log.Fatal(err)
	}
	script := `
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		status TEXT NOT NULL
	);`

	_, err = DB.Exec(script)
	if err != nil {
		log.Fatal(err)
	}
}

func CreateTask(task *dto.Task) (*dto.Task, error) {
	res, err := DB.Exec("INSERT INTO tasks (title, status) VALUES (?, ?)",
		task.Title, task.Status)
	if err != nil {
		return nil, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	task.ID = int(id)
	return task, nil
}
