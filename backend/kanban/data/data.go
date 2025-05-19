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
	DB, err = sql.Open("sqlite3", "tasks.db")
	err = DB.Ping()
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
		log.Println(err)
		return nil, err
	}
	task.ID = int(id)
	return task, nil
}

func DeleteTask(id int) error {
	_, err := DB.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func UpdateTask(task *dto.Task) (*dto.Task, error) {
	tx, err := DB.Begin()
	_, err = DB.Exec("Update tasks set title = ?, status = ?  where id = ?", task.Title, task.Status, task.ID)
	if err != nil {
		return nil, err
	}
	var res dto.Task
	err = DB.QueryRow("Select id, title, status FROM tasks where id = ?", task.ID).Scan(&res.ID, &res.Title, &res.Status)

	err = tx.Commit()

	if err != nil {
		return nil, err
	}
	return &res, nil
}

func GetTasks() ([]dto.Task, error) {
	rows, err := DB.Query("SELECT id, title, status FROM tasks")
	if err != nil {
		log.Println(err)
		return nil, err
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Println(err)
		}
	}(rows)

	var tasks []dto.Task
	for rows.Next() {
		var task dto.Task
		if err := rows.Scan(&task.ID, &task.Title, &task.Status); err != nil {
			log.Fatal(err)
		}
		tasks = append(tasks, task)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
	if tasks == nil {
		//return an empty slice instead of nil
		tasks = []dto.Task{}
	}
	return tasks, err
}
