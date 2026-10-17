package dto

type Task struct {
	ID     int    `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"`
	// Description holds rich-text HTML.
	Description string `json:"description"`
}
