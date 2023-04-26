namespace KanbanApp.Data;

public class Project
{
    public Project() {
        this.Name = "default";
    }
    public int Id {get;set;}
    public string Name {get;set;}
    public string? Summary { get; set; }
}
