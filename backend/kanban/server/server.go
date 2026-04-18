package server

import (
	"encoding/json"
	"log"
	"net/http"

	"kanban/db"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct {
	queries *db.Queries
}

func New(queries *db.Queries) *Server {
	return &Server{queries: queries}
}

func (s *Server) Start() {
	r := chi.NewRouter()

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
	}))
	r.Use(middleware.Logger)
	r.Use(middleware.SetHeader("Content-Type", "application/json"))

	r.Get("/tasks", s.getTasks)
	r.Post("/tasks", s.createTask)
	r.Put("/tasks", s.updateTask)
	r.Delete("/tasks", s.deleteTask)

	log.Println("Server started at :8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}
}

func (s *Server) getTasks(w http.ResponseWriter, r *http.Request) {
	tasks, err := s.queries.GetTasks(r.Context())
	if err != nil {
		http.Error(w, "Failed to retrieve tasks", http.StatusInternalServerError)
		return
	}
	if tasks == nil {
		tasks = []db.Task{}
	}
	json.NewEncoder(w).Encode(tasks)
}

func (s *Server) createTask(w http.ResponseWriter, r *http.Request) {
	var params db.CreateTaskParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	task, err := s.queries.CreateTask(r.Context(), params)
	if err != nil {
		http.Error(w, "Failed to create task", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func (s *Server) updateTask(w http.ResponseWriter, r *http.Request) {
	var req db.Task
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	task, err := s.queries.UpdateTask(r.Context(), db.UpdateTaskParams{
		Title:  req.Title,
		Status: req.Status,
		ID:     req.ID,
	})
	if err != nil {
		http.Error(w, "Failed to update task", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(task)
}

func (s *Server) deleteTask(w http.ResponseWriter, r *http.Request) {
	var req db.Task
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	task, err := s.queries.DeleteTask(r.Context(), req.ID)
	if err != nil {
		http.Error(w, "Failed to delete task", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(task)
}
