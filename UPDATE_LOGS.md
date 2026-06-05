# HISTÓRICO DE MODIFICAÇÕES

Este documento registra as alterações realizadas no projeto ao longo do desenvolvimento.

---

## 2026-06-05 02:00

### Alterações Gerais

**Adicionado**

* Adicionado funções adicionais para futura re-imprementação do microfone

**Modificado**

* Estilização da tela de configurações finalizada

<br>

## 2026-06-04 23:20

### Alterações Gerais

**Adicionado**

* Áudios irritantes para verificar sensibilidade do usuário

**Modificado**

* Formato do estado global interno atualizado.

### Interface e Estilização

* Finalização da estilização da tela inicial.

### Tela de Configurações

#### Monitoramento

**Adicionado**

* Tempo entre trocas: define o intervalo, em segundos, antes da troca automática de áudio.
* Atraso: define o tempo, em milissegundos, utilizado para confirmar o nível atual de decibéis.
* Desvio de calibração: permite ajustar manualmente o valor final dos decibéis medidos.

#### Perfis

**Adicionado**

* Casa: perfil voltado para ambientes silenciosos ou com baixo nível de ruído.
* Escola: perfil para ambientes com alternância frequente entre silêncio e ruído.
* Trabalho: perfil para ambientes moderadamente ruidosos.
* Transporte: perfil para ambientes com altos níveis de ruído.
* Sono: perfil para ambientes predominantemente silenciosos.

#### Notificações

**Adicionado**

* Notificar ruído elevado: envia uma notificação quando o nível configurado de decibéis é atingido.
* Notificar ao ativar gatilho: envia uma notificação sempre que um gatilho for acionado.
* Ouvir referência: auxilia na definição de um valor adequado para notificações de ruído.

**Removido**

* Notificação de bateria baixa.

#### Rodapé

**Adicionado**

* Versão do software.

**Removido**

* ID do hardware.
* Versão do firmware.

#### Recursos

**Removido**

* Pareamento de headset.
* Modo de economia de energia.

### Tela Inicial

**Adicionado**

* Possibilidade de pausar o monitoramento.
* Barra dinâmica para indicação visual do nível de perigo relacionado ao ruído.
* Botões para ajuste de sensibilidade.
* Possibilidade de pausar a reprodução de áudio.
