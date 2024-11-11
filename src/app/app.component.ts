import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TodoStore } from './store/todo.store';
import { FormsModule } from '@angular/forms';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [ CommonModule, RouterModule, FormsModule, SnackbarComponent]
})
export class AppComponent {

  newTodoTitle = signal('')

  store = inject(TodoStore)

  snackbar = viewChild.required(SnackbarComponent)

  constructor(){
    effect(() => {
      const allCompleted = this.store.todos().every((todoItem => todoItem.completed))
      if (allCompleted) {
        this.snackbar().show()
      } else {
        this.snackbar().hide
      }
    })
  }

  submitNewTodo(){
    this.store.addTodos(this.newTodoTitle())
    this.newTodoTitle.set('')
  }

}
