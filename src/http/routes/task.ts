import { Type } from '@sinclair/typebox'
import { prisma } from '../prisma'
import type { FastifyTypedInstance } from '../types'

export default function (server: FastifyTypedInstance) {
  server.get(
    '/tasks/:id',
    {
      schema: {
        description: 'Get a task by ID',
        params: Type.Object({
          id: Type.Integer(),
        }),
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Integer(),
              title: Type.String(),
              status: Type.Integer(),
            })
          ),
        },
      },
    },
    async (req, res) => {
      const { id } = req.params
      const tasks = await prisma.task.findMany({
        where: {
          id,
        },
      })

      res.status(200).send(tasks)
    }
  )
  server.get(
    '/tasks',
    {
      schema: {
        description: 'Get all tasks',
        response: {
          200: Type.Array(
            Type.Object({
              id: Type.Integer(),
              title: Type.String(),
              status: Type.Integer(),
            })
          ),
        },
      },
    },
    async (_req, res) => {
      const tasks = await prisma.task.findMany()

      res.status(200).send(tasks)
    }
  )
  server.post(
    '/tasks',
    {
      schema: {
        description: 'Create a new task',
        body: Type.Object({
          title: Type.String(),
        }),
        response: {
          201: Type.Object({
            id: Type.Integer(),
            title: Type.String(),
            status: Type.Integer(),
          }),
        },
      },
    },
    async (req, res) => {
      const { title } = req.body
      const task = await prisma.task.create({
        data: {
          title,
        },
      })

      res.status(201).send(task)
    }
  )
  server.put(
    '/tasks/:id',
    {
      schema: {
        description: 'Update a task by ID',
        params: Type.Object({
          id: Type.Integer(),
        }),
        body: Type.Object({
          title: Type.String(),
          status: Type.Integer(),
        }),
        response: {
          200: Type.Object({
            id: Type.Integer(),
            title: Type.String(),
            status: Type.Integer(),
          }),
        },
      },
    },
    async (req, res) => {
      const { id } = req.params
      const { title, status } = req.body
      const task = await prisma.task.update({
        where: {
          id,
        },
        data: {
          title,
          status,
        },
      })

      res.status(200).send(task)
    }
  )
  server.delete(
    '/tasks/:id',
    {
      schema: {
        description: 'Delete a task by ID',
        params: Type.Object({
          id: Type.Integer(),
        }),
        response: {
          204: Type.Null(),
        },
      },
    },
    async (req, res) => {
      const { id } = req.params
      await prisma.task.delete({
        where: {
          id,
        },
      })

      res.status(204).send(null)
    }
  )
}
