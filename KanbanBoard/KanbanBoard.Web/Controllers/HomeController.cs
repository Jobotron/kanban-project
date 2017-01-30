using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

namespace KanbanBoard.Web.Controllers{


    public class HomeController:Controller{
        public ActionResult Index(){
            return View();
        }
    }
}