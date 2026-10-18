import {mountAssistant} from './assistant.mjs'
import {parsePlan,inspectPlan} from './plan.mjs'
export function startBiziva(mindMap,doc){
  const host=doc.createElement('div');doc.body.append(host)
  return mountAssistant(host,{
    title:'Biziva Mapas',
    description:'Transforme uma meta em um ramo de ações com responsáveis e prazos sugeridos. O mapa existente permanece editável.',
    placeholder:'Planeje a operação de vendas de sites para pequenos negócios…',
    sourceUrl:'https://github.com/omatheuslop/biziva-mapas',
    instruction:'Retorne apenas JSON de uma árvore {"text":"Objetivo","children":[{"text":"Ação concreta","owner":"Papel responsável","deadline":"Prazo sugerido","children":[]}]}. Até 120 nós e 7 níveis, máximo 15 filhos por nó, texto até 180 caracteres. Toda folha deve ter owner e deadline. Sugira papéis e prazos; não invente pessoas reais ou compromissos. Não use HTML.',
    parse:parsePlan,
    inspect:()=>inspectPlan(mindMap.getData()),
    apply:tree=>{
      if(!mindMap.renderer.root)throw Error('O mapa ainda está carregando.')
      mindMap.execCommand('INSERT_CHILD_NODE',false,[mindMap.renderer.root],tree.data,tree.children)
    }
  })
}
