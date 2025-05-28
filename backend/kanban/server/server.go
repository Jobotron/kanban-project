package server

import (
	"encoding/json"
	"fmt"
	"github.com/jobotron/kanban/data"
	"github.com/jobotron/kanban/dto"
	"github.com/rs/cors"
	"io"
	"log"
	"net/http"
	"strconv"
)

const ContentTypeJson = "application/json"
const ContentTypeHeader = "Content-Type"

func JSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set(ContentTypeHeader, ContentTypeJson)
		next.ServeHTTP(w, r)
	})
}

func Handler(w http.ResponseWriter, _ *http.Request) {
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
		w.Header().Set(ContentTypeHeader, ContentTypeJson)
		w.WriteHeader(http.StatusOK)
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
		w.WriteHeader(http.StatusCreated)
		err = json.NewEncoder(w).Encode(createdTask)
		if err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}
	case http.MethodPut:
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read request body", http.StatusBadRequest)
		}
		var task dto.Task
		if err := json.Unmarshal(body, &task); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
		task.ID, err = strconv.Atoi(r.PathValue(`task_id`))
		if err != nil {
			http.Error(w, "Id was not even a number really was it?", http.StatusBadRequest)

		}
		updatedTask, err := data.UpdateTask(&task)

		w.WriteHeader(http.StatusOK)
		err = json.NewEncoder(w).Encode(updatedTask)
		if err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
			return
		}

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func Start() {
	mux := http.NewServeMux()

	mux.Handle("/tasks", JSONMiddleware(http.HandlerFunc(TasksHandler)))
	mux.Handle("/", JSONMiddleware(http.HandlerFunc(Handler)))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
	})
	handler := c.Handler(mux)

	log.Println("Server started at :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
