import { getState, patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals'
import { TodoItem } from './todo.model'
import { computed, effect } from '@angular/core'

const storeKey = 'ng_todo'

type TodoState = {
    todos: TodoItem[],
    filter: TodoFilter
}

type TodoFilter = 'all' | 'active' | 'completed'

const initialState: TodoState = {
    todos: [],
    filter: 'all'
}

export const TodoStore = signalStore({ providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        completedTodos: computed(() =>
            store.todos().filter((todoItem) => {
                return todoItem.completed
            })),
        filteredTodos: computed(() => {
            switch (store.filter()) {
                case 'completed':
                    return store.todos().filter((todoItem) => {
                        return todoItem.completed
                    })
                case 'active':
                    return store.todos().filter((todoItem) => {
                        return !todoItem.completed
                    })
                default:
                    return store.todos()
            }
        })
    })),
    withMethods((store) => ({
        addTodos(newTodoTitle: string) {
            patchState(store, {
                todos: [{
                    title: newTodoTitle,
                    id: Date.now().toString(),
                    completed: false
                }, ...store.todos()]
            })
        },
        toggleTodo(todoId: string) {
            patchState(store, {
                todos: store.todos().map(todoItem => {
                    if (todoItem.id == todoId) {
                        return {
                            ...todoItem,
                            completed: !todoItem.completed
                        }
                    }
                    return todoItem
                })
            })
        },
        changeFilter(filter: TodoFilter) {
            patchState(store, {filter})
        }
    })),
    withHooks({
        onInit(store){
            const getTodoLocalstorage = JSON.parse(
                localStorage.getItem(storeKey) || '[]'
            )
            patchState(store, {todos: getTodoLocalstorage})
            effect(() =>{
                const state = getState(store)
                localStorage.setItem(storeKey, JSON.stringify(state.todos))
            })
        }
    })
)