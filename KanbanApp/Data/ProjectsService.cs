namespace KanbanApp.Data;

public class ProjectService
{
    private static List<Project> _projects = new List<Project>();
    public ProjectService()
    {
        _projects.Add(new Project()
        {
            Id = 1,
            Name = "project 1",
            Summary = "pain."
        });
    }

    public Task<Project[]> GetProjectsAsync()
    {
        return Task.Run(() =>
         _projects.ToArray()
        );
    }
}
