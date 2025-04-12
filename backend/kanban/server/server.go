package server

import (
	"encoding/json"
	"fmt"
	"github.com/jobotron/kanban/data"
	"github.com/jobotron/kanban/dto"
	"io"
	"log"
	"net/http"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	_, err := fmt.Fprintln(w, "Hello, world!")
	if err != nil {
		log.Println(err)
	}
}

func TasksHandler(w http.ResponseWriter, r *http.Request) {
	// Handle task creation
	switch r.Method {
	case http.MethodGet:
		tasks, err := data.GetTasks()
		if err != nil {
			http.Error(w, "Failed to retrieve tasks", http.StatusInternalServerError)
			return
		}
		err = json.NewEncoder(w).Encode(tasks)
		if err != nil {
			http.Error(w, "Failed to encode tasks", http.StatusInternalServerError)
			return
		}
	case http.MethodPost:
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
			return
		}

		defer func(Body io.ReadCloser) {
			_ = Body.Close()
		}(r.Body)

		var task dto.Task
		if err := json.Unmarshal(body, &task); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		createdTask, err := data.CreateTask(&task)
		if err != nil {
			http.Error(w, "Failed to create task", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		err = json.NewEncoder(w).Encode(createdTask)
		if err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func Start() {
	http.HandleFunc("/tasks", TasksHandler)
	http.HandleFunc("/", Handler)
	log.Println("Server started at :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
