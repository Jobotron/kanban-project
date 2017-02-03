
using System.Collections.Generic;
namespace KanbanBoard.Data.entities{
public class Backlog{
    public int BacklogId{get;set;}
    public string CreationDate{get;set;}

    public IEnumerable<TaskItem> Tasks{get;set;}


}
}