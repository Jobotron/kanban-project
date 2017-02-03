using KanbanBoard.Data.entities;

namespace KanbanBoard.Data.interfaces{

public interface IBacklogEngine{
     void Create(Backlog Backlog);

     void Update(Backlog Backlog);

     Backlog GetBacklogById(int id);

     void Delete(int id);



}
}