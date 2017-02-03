
using KanbanBoard.Data.entities;

namespace KanbanBoard.Data.interfaces
{
    

public interface IProjectEngine{
    void Create(Project project);

    void Update (Project p);

    Project RetrieveById(int Id);

    void Delete(int Id);

    
}
}