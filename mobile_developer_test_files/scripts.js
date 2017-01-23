console.log("starts")
var model = new function(){

	var projects = new Array()
	projects.push(new Project(12,"Projekti 1",[new Task(3,"Task 1",5),new Task(4,"Task 2",3)]))
	projects.push(new Project(17,"Projekti 2",[new Task(2,"Task 3",2),new Task(17,"Task 4",12),new Task(18,"Task 4",12)]))
//test for objects in the list, delete for deployment.
this.puke = function(){
  return projects;
}
//Delete ends here.
	this.loadProjects = function(callback){
		var r = new Array()
		projects.forEach(function(p){
			r.push(p.clone())
		})

		callback(r);
  }

	this.deleteProject = function(id){
    //There are more solutions for the deleting, which will be faster, and will be explained in an email.
    projects.forEach(function(project){
      if(project.id == id){
        arrayIndex = projects.indexOf(project);
        if(arrayIndex !== -1){
          projects.splice(arrayIndex,1);
          refresh(projects);
          function sendDelete(){
            http.request('delete' + id);
          }
        }
      }
    })
	}
}

function Project(id,name,tasks) {
	this.id = id
	this.name  = name
	this.tasks = tasks

	this.clone = function(){
		return new Project(id,name,tasks)
	}
}
console.log("Project initialized")

function Task(id,title,estimateInHours) {
	this.id = id
	this.title = title;
	this.estimateInHours = estimateInHours
}

$(window).ready(function(){
	console.log("debug 1")

	var container = $("#dataContent")

	model.loadProjects(function(projects){
    refresh(projects);
	})
	console.log("debug 3")
})
var refresh = function(projects){
  document.getElementById('dataContent').innerHTML=('');
  projects.forEach(function(projectItem){
    //Creating a father DIV
    var projectDiv = document.createElement('DIV');
    projectDiv.id = projectItem.id;
    projectDiv.className = 'project'
    projectDiv.addEventListener('click', (function(){
      if (document.getElementById(this.id).childNodes[1].className !== 'hide'){
        document.getElementById(this.id).childNodes[1].className = 'hide';
      }else{
        document.getElementById(this.id).childNodes[1].className = 'show';
      }

    }))
    //Delete Button
    var deleteButton = document.createElement('Button');
    deleteButton.innerHTML = "Delete project";
    deleteButton.addEventListener('click', (function(){
      model.deleteProject(this.parentNode.id);
    }))

    //Header for the project
    var titleElm = document.createElement('H3');
    var titleText = document.createTextNode(projectItem.name);
    //append every text for its respective parent
    titleElm.appendChild(titleText);
    projectDiv.appendChild(titleElm);
    //Task list
    var taskMenu = document.createElement('ul');
    taskMenu.className = 'hide';
    projectItem.tasks.forEach(function(taskItem){
      taskElm = document.createElement('IL');
      taskElm.id = taskItem.id;
      taskDiv = document.createElement('div');
      taskDiv.className = 'task'
      taskText = document.createTextNode(taskItem.title + ' Will require ' + taskItem.estimateInHours + ' Centuries');
      taskElm.appendChild(taskText);
      taskDiv.appendChild(taskElm);
      taskMenu.appendChild(taskDiv);
    });
    projectDiv.appendChild(taskMenu);
    projectDiv.appendChild(deleteButton);
    document.getElementById('dataContent').appendChild(projectDiv);
  })
}
