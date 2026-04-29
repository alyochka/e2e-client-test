export default [
  {
    name: 'petstore-api',
    input: { target: './petstore.json' },
    output: {
      target: './app/client/generated/',
      mode: 'tags',
      client: 'axios',
      override: {
        mutator: {
          path: '../custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
  {
    name: 'petstore-mocks',
    input: { target: './petstore.json' },
    output: {
      target: './app/client/mocks/',
      mode: 'tags',
      mock: {
        type: 'msw',
        delay: 500,
        useExamplesFromSpec: true,
      },
    },
  },
]
