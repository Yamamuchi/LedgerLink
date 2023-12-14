import {expect, test} from '@oclif/test'

describe('deploy-contract', () => {
  test
  .stdout()
  .command(['deploy-contract'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['deploy-contract', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
