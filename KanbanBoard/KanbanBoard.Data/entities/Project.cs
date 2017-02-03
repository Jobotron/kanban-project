using System.Collections.Generic;

namespace KanbanBoard.Data.entities{
public class Project{
    public int ProjectId{get;set;}

    public string Title{get;set;}

    public string Description{get;set;}
    
    public IEnumerable<Backlog> Backlogs{get;set;}
    



}
}