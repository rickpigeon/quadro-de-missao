# Quadro de Missão

Módulo para Foundry VTT **v13** que coloca o quadro de missões da Guilda de Candeh’ssa na mesa,
para a campanha *Jornada Heroica: A Libertação de Valkaria* (Tormenta20).

O mestre gera missões com as tabelas de "Aventuras sem fim!" do livro. O módulo escreve o cartaz
de acordo com o que saiu, e os jogadores leem os cartazes num quadro de cortiça.

As páginas citadas são do livro *Jornada Heroica: A Libertação de Valkaria* (Jambô, 2025).
O módulo traz só as tabelas e um resumo curto das regras; o texto dos cartazes foi escrito para o
módulo. Para jogar, é preciso ter o livro.

## Como abrir

- **Todos:** botão **Quadro de Missão** (ícone de pergaminho) nos controles de token, à esquerda.
- **Atalho:** em *Configurar controles* há "Abrir o Quadro de Missão" e "Gerar missão (mestre)", sem tecla definida.
- **Macro:** `game.modules.get("quadro-de-missao").api.open()`.
- **Mestre para todos:** o botão de pessoas na barra do quadro abre o quadro na tela de todos os jogadores.
  No cartaz ampliado, "Mostrar para todos" abre aquele cartaz na tela de todo mundo.

## Gerar uma missão (mestre)

Clique em **Gerar missão** no quadro. A janela já vem com tudo rolado.

| Tabela | Dado | Página |
|---|---|---|
| Solicitante | 2d8 (2–3 Taverna … 16 Guilda) | 34 |
| Objetivo | 1d8 (Manufatura, Escolta, Entrega, Caça, Ritual, Recuperação, Resgate, Pesquisa) | 34 |
| Recompensa | 1d6 (Informação, Favor, Tesouro riqueza/item/ambos, 1d4 PA) | 34 |

- Cada tabela tem o seu botão de dado e um seletor para escolher à mão. "Poder" (p. 34) não está no
  1d6 do livro, então só entra escolhido à mão.
- O morador que assina vem do lugar sorteado (pp. 35-45). O botão de embaralhar troca o morador.
- O que cada objetivo pede (p. 33) é rolado junto:
  - câmara numerada;
  - 2d4 espaços do item (Entrega e Recuperação) ou 1d3 de matéria-prima (Manufatura);
  - a presa da Caça, rolada na tabela de encontros da masmorra.
- A CD é 15 + o nível da masmorra.
- **Outro texto** troca só a redação do cartaz e mantém a mesma missão.
- **Afixar no quadro** publica o cartaz. **Guardar como rascunho** deixa o cartaz só para você. **Editar antes** abre o editor.

Detalhes que o módulo decidiu:

- **Câmara:** é sorteada entre as áreas numeradas da masmorra, sem a última, que é a do Guardião.
  Você pode digitar qualquer outra.
- **Presa da Caça:** resultados que não são criaturas são rolados de novo. São as armadilhas de Hyninn,
  a areia movediça de Azgher e os servos não combatentes de Keenn.
- **Masmorras sem tabela:** Tanna-Toh e Khalmyr não têm tabela de encontros, então você escreve a presa.
- **Nimb:** usa o 1d20 da p. 158 para escolher a tabela de outra masmorra. Com 18, usa a tabela de piada
  do próprio Nimb, sorteando uma das 8 linhas. Quando cai em masmorra sem tabela, rola de novo.
- **Segredo da ordem das masmorras (p. 46):** por padrão o cartaz diz só "a próxima masmorra" e o número dela.
  O nome do deus não aparece, nem dentro do nome das criaturas: "arqueiro élfico" no lugar de
  "arqueiro de Glórienn". Para mostrar o deus, use as opções.

## O quadro

- **Filtros:** Em aberto, Cumpridas e fracassadas, Todas.
- **Cartaz ampliado:** clique num cartaz para ler tudo (texto, onde, termos e recompensa).
- **Limite de missões:** o contador "Aceitas" compara com o limite do livro, que é uma missão aceita por
  personagem jogador (p. 33).
- **Só o mestre vê:**
  - os rascunhos;
  - as **notas do mestre** de cada cartaz: a masmorra e a área do mapa com página, o Agrado aos Deuses,
    as regras escondidas (+2 nos ataques depois de uma Recuperação, por exemplo) e as rolagens;
  - os botões de cada cartaz: editar, esconder ou mostrar, chat, excluir, aceitar, cumprida, fracassou,
    reabrir e duplicar.
- **Ao marcar como cumprida:**
  - o 1d4 de PA é rolado;
  - opcionalmente, a recompensa extra da honraria da Guilda (p. 31) e as duas recompensas da Myssia, Leal (p. 41);
  - o resultado sai no chat.
- **Ao marcar como fracassada uma Escolta:** dá para marcar o morador como fora de jogo (p. 33).

## Opções (engrenagem no quadro)

- Próxima masmorra. Também aparece na barra do quadro e nas configurações do módulo.
- Mostrar o deus da masmorra nos cartazes.
- Número de personagens jogadores. Com 0, o módulo conta os jogadores que têm personagem.
- Missões cumpridas. Sobe sozinho e serve para liberar Eh’mmed, que só aparece depois da 10ª masmorra
  ou de 5 missões (p. 37).
- Moradores fora de jogo. Eles não assinam missões novas.

## Observações

- **Onde os dados ficam:** os cartazes ficam numa configuração do mundo, que chega a todos os clientes.
  O quadro nunca mostra rascunhos nem notas do mestre aos jogadores. Mesmo assim, um jogador que abra o
  console do navegador conseguiria lê-los.
- **Sistema:** o módulo não depende do sistema Tormenta20 do Foundry.
- **Testes:** foi testado num ambiente simulado do Foundry, não num Foundry de verdade.
  Se algo falhar, o módulo mostra o erro numa notificação vermelha.

## API

```js
const api = game.modules.get("quadro-de-missao").api;
api.open();                          // abre o quadro nesta tela
api.show();                          // mestre: abre o quadro na tela de todos
api.generator();                     // mestre: abre o gerador
await api.generate({ visible: true }); // mestre: rola uma missão inteira e afixa
api.posters();                       // cópias de todos os cartazes
```

## Licença

MIT (código). Tormenta20 e *A Libertação de Valkaria* são da Jambô Editora.
