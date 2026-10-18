import {parseJSON,cleanText} from './assistant.mjs'
const plain=value=>cleanText(value,180).replace(/[<>&]/g,' ')
export function parsePlan(text){
  const root=parseJSON(text);let count=0
  function visit(node,depth){
    if(++count>120||depth>7)throw Error('Plano muito grande. Use até 120 nós e sete níveis.')
    const children=node.children===undefined?[]:node.children
    if(!Array.isArray(children)||children.length>15)throw Error('Lista de subtarefas inválida.')
    const label=plain(node.text)
    const data={text:label,richText:false}
    if(!children.length)data.text+='\nResponsável: '+plain(node.owner)+'\nPrazo: '+plain(node.deadline)
    return {data,children:children.map(child=>visit(child,depth+1))}
  }
  return visit(root,0)
}
export function inspectPlan(root){
  const queue=[root];let count=0,withoutOwner=0,withoutDeadline=0,large=0
  while(queue.length&&count<2000){
    const node=queue.shift();count++
    const text=String(node.data&&node.data.text||'')
    if(!(node.children&&node.children.length)){
      if(!/Responsável:/.test(text))withoutOwner++
      if(!/Prazo:/.test(text))withoutDeadline++
    }
    if(text.length>300)large++
    if(node.children)queue.push(...node.children)
  }
  const issues=[]
  if(withoutOwner)issues.push(`${withoutOwner} folhas sem responsável no formato do plano de ação.`)
  if(withoutDeadline)issues.push(`${withoutDeadline} folhas sem prazo no formato do plano de ação.`)
  if(large)issues.push(`${large} nós longos; considere dividir o conteúdo para facilitar a leitura.`)
  if(queue.length)issues.push('Revisão limitada aos primeiros 2000 nós.')
  return issues
}
