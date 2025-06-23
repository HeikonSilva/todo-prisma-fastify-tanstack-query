import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Ellipsis, Moon, Sun } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteTasksByIdMutation,
  getTasksOptions,
  postTasksMutation,
  putTasksByIdMutation,
} from '@/api/@tanstack/react-query.gen'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type {
  DeleteTasksByIdData,
  PostTasksData,
  PutTasksByIdData,
} from './api'
import { useTheme } from './components/theme-provider'

function App() {
  const { setTheme } = useTheme()
  const queryClient = useQueryClient()

  const { data: queryTasks } = useQuery({
    ...getTasksOptions(),
    refetchInterval: 1000,
  })

  const createTaskForm = useForm<PostTasksData>()

  const { mutateAsync: createTask } = useMutation({
    mutationFn: async (data: PostTasksData) => {
      const response = await postTasksMutation({
        body: {
          title: data.body.title,
        },
      }).mutationFn()
      return response // This will contain the newly created task with id and status
    },
    onSuccess: (newTask) => {
      queryClient.setQueryData(
        getTasksOptions().queryKey,
        (oldData: typeof queryTasks) => {
          if (!oldData) return [newTask]
          return [...oldData, newTask]
        }
      )
    },
  })

  async function handleCreateTaskSubmit(data: PostTasksData) {
    try {
      await createTask(data)
    } catch (error) {
      console.log(error)
    }
  }

  const editTaskForm = useForm<PutTasksByIdData>()

  const { mutateAsync: putTask } = useMutation({
    mutationFn: async (data: PutTasksByIdData) => {
      const response = await putTasksByIdMutation({
        body: {
          title: data.body.title,
          status: data.body.status,
        },
        path: {
          id: data.path.id,
        },
      }).mutationFn()
      return response
    },
    onSuccess(data, variables) {
      queryClient.setQueryData(
        getTasksOptions().queryKey,
        (oldData: typeof queryTasks) => {
          if (!oldData) return []
          return oldData.map((task) =>
            task.id === variables.path.id ? { ...task, ...data } : task
          )
        }
      )
    },
  })

  async function handleEditTaskSubmit(data: PutTasksByIdData) {
    try {
      await putTask(data)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTaskForm = useForm<DeleteTasksByIdData>()

  const { mutateAsync: deleteTask } = useMutation({
    mutationFn: async (data: DeleteTasksByIdData) => {
      const response = await deleteTasksByIdMutation({
        path: {
          id: data.path.id,
        },
      }).mutationFn()
      return response
    },
    onSuccess(_, variables) {
      queryClient.setQueryData(
        getTasksOptions().queryKey,
        (oldData: typeof queryTasks) => {
          if (!oldData) return []
          return oldData.filter((task) => task.id !== variables.path.id)
        }
      )
    },
  })

  async function handleDeleteTaskSubmit(data: DeleteTasksByIdData) {
    try {
      await deleteTask(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center transition-all">
      <Card>
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-xs">Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queryTasks?.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    {task.status === 0
                      ? 'Pending'
                      : task.status === 1
                      ? 'In Progress'
                      : task.status === 2
                      ? 'Completed'
                      : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={'ghost'}>
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault()
                                  // Set default values including path.id and body fields
                                  editTaskForm.reset({
                                    path: { id: task.id },
                                    body: {
                                      title: task.title,
                                      status: task.status,
                                    },
                                  })
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Task</DialogTitle>
                                <DialogDescription>
                                  Update the task details below.
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...editTaskForm}>
                                <form
                                  className="space-y-4"
                                  onSubmit={editTaskForm.handleSubmit(
                                    handleEditTaskSubmit
                                  )}
                                >
                                  <FormField
                                    control={editTaskForm.control}
                                    name="body.title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Task Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Enter task name"
                                            defaultValue={task.title}
                                            {...field}
                                            required
                                          />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={editTaskForm.control}
                                    name="body.status"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                          onValueChange={field.onChange}
                                          defaultValue={task.status.toString()}
                                        >
                                          <FormControl>
                                            <SelectTrigger className="w-full">
                                              <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="0">
                                              Pending
                                            </SelectItem>
                                            <SelectItem value="1">
                                              In Progress
                                            </SelectItem>
                                            <SelectItem value="2">
                                              Completed
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button type="submit">
                                        Save changes
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.preventDefault()
                                  // Set default values including path.id and body fields
                                  deleteTaskForm.reset({
                                    path: { id: task.id },
                                  })
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will delete your task permanently.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <Form {...deleteTaskForm}>
                                <form
                                  onSubmit={deleteTaskForm.handleSubmit(
                                    handleDeleteTaskSubmit
                                  )}
                                >
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction type="submit">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </form>
                              </Form>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog>
            <DialogTrigger asChild>
              <div className="flex justify-end mt-4">
                <Button variant={'default'}>Add Task</Button>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Fill in the details of the new task below.
                </DialogDescription>
              </DialogHeader>
              <Form {...createTaskForm}>
                <form
                  className="space-y-4"
                  onSubmit={createTaskForm.handleSubmit(handleCreateTaskSubmit)}
                >
                  <FormField
                    control={createTaskForm.control}
                    name="body.title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter task name"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="submit">Add Task</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="absolute bottom-4 right-4"
            variant="outline"
            size="icon"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default App
