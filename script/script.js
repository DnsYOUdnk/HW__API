const Todo = function() {
    let toDoData = JSON.parse(localStorage.getItem('toDoData')) || [];
    let checkToDoFlag = false;
    this.init = () => {
        this.create();
        this.getTodo();
    }

    this.create = () => {
        const appToDo = document.createElement('div');
              appToDo.classList.add('todo__app');
        const header = document.createElement('header');
              header.classList.add('header');      
        const appToDoHeader = document.createElement('div');
              appToDoHeader.classList.add('todo__app__header', 'container');
        const appToDoTitle = document.createElement('h1');
              appToDoTitle.classList.add('todo__title');
              appToDoTitle.innerText = 'ToDo List';
        const todoSelectAllButton = document.createElement('button');
              todoSelectAllButton.classList.add('todo__select-all__btn');
              todoSelectAllButton.innerText = 'Выделить все задачи';
        const todoDeleteAllButton = document.createElement('button');
              todoDeleteAllButton.classList.add('todo__delete-all__btn');
              todoDeleteAllButton.innerText = 'Удалить выделенные задачи';
        const main = document.createElement('main');
              main.classList.add('main');      
        const appToDoMain = document.createElement('div');
              appToDoMain.classList.add('todo__app__main', 'container');

        appToDoHeader.append(appToDoTitle, todoSelectAllButton, todoDeleteAllButton);  
        header.appendChild(appToDoHeader);
        main.appendChild(appToDoMain);
        appToDo.append(header, main);
        document.body.append(appToDo);

        todoSelectAllButton.addEventListener('click', () => {
            checkToDoFlag = !checkToDoFlag ? true : false;
            this.selectAllElements()
        })

        todoDeleteAllButton.addEventListener('click', () => {
            this.deleteAllCheckElements()
        })
    }

    this.getTodo = async () => {
        const url='https://jsonplaceholder.typicode.com/todos';

        if (toDoData.length > 0) {
            this.show()
        } else {
            try{
                response = await fetch(url)
                data = await response.json()
                toDoData = data
                this.show()
            } catch (e) {
                console.error(e)
            } finally {
                console.log('finally')
            }
        }
    }

    this.show = () => {
        localStorage.setItem('toDoData', JSON.stringify(toDoData))

        let todo = document.querySelector('.todo__app__main');
        if (!todo) return 

        let ul = document.querySelector('.todo__list')
        if(!ul) {
            ul = document.createElement('ul')
            ul.classList.add('todo__list')
        }

        let list = ''
        toDoData.forEach(({completed, id, title}) => {
            list += `<li class="todo__list__item ${completed ? 'active': ''} ">
                        <div><span>${id}</span> <input type="checkbox" ${completed ? 'checked' : ""} class="input__todo__item" data-check=${id}>${title}</div>
                             ${completed ? '<button class="todo__item__btn" data-delete=' + id + '>Удалить</button>' : ''}
                    </li>`        
        });

        ul.innerHTML = list;
        todo.appendChild(ul);

        this.eventItemToDoCheck()
    }

    this.eventItemToDoCheck = () => {
        const inputCheck = document.querySelectorAll('.input__todo__item')
        inputCheck.forEach(item => {
            item.addEventListener('click', (e) => {
                this.edit(e.target.checked, e.target.dataset.check)
            })
        })

        const todoItemDelBtns = document.querySelectorAll('.todo__item__btn')
        todoItemDelBtns.forEach(deleteBtn => {
            deleteBtn.addEventListener('click', (e) => {
                this.delete(e.target.dataset.delete)
            })
        })
    }

    this.edit = (newCompleted, idToDo) => {
        toDoData = toDoData.map(data => {
            if(data.id == idToDo) {
                return data = {...data, completed: newCompleted}
            } else return data
        })

        this.show()
    }

    this.delete = (idBtn) => {
        toDoData = toDoData.filter(({id}) => id != idBtn);
        this.show()
    }

    this.selectAllElements = () => {
        toDoData = toDoData.map(data => data = {...data, completed: checkToDoFlag})
        this.show()
    }

    this.deleteAllCheckElements = () => {
        toDoData = toDoData.filter(({completed}) => completed != true);
        this.show()
    }
}

window.addEventListener('load', ()=>{
    const todoList = new Todo()
    todoList.init();
})