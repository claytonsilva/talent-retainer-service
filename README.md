# Talent Retainer Service

![talento](./talento-avelas.png)

[![Coverage Status](https://coveralls.io/repos/github/claytonsilva/talent-retainer-service/badge.svg?branch=main)](https://coveralls.io/github/claytonsilva/talent-retainer-service?branch=main)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fclaytonsilva%2Ftalent-retainer-service%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/claytonsilva/talent-retainer-service/main)[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Conventional Changelog](https://img.shields.io/badge/changelog-conventional-brightgreen.svg)](http://conventional-changelog.github.io)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![CircleCI](https://circleci.com/gh/claytonsilva/talent-retainer-service.svg?style=svg)](https://circleci.com/gh/claytonsilva/talent-retainer-service)

## Objetivo do servico

O servico tem como objetivo controlar o ciclo de vida de abertura de vagas de oportunidades de trabalho e banco de talentos.

## Como é distribuído as responsabilidades

Organizo a base de código usando um esquema de monorepo me aproveitando bem da arquitetura hexagonal:

```console
.
+-- ports/aws-lambda
|   +-- talents.handler.js
|   +-- talents-worker.handler.js
|   +-- openings.handler.js
|   +-- openings-worker.handler.js

```

Por se tratar de microservicos que em conjunto resolve um problema em específico e estão interligados em termos de negócio, ficou coerente unificar todos eles em uma mesma base de código.

Utilizei o template de hexagonal [disponível nesse repositório](https://github.com/claytonsilva/nodejs-hexagonal-boilerplate) como base de desenvolvimento.

* talents.handler: responsável pelo controle de ciclo de vida dos dados de **talentos**, ele deve controlar todo o ciclo de vida, mas não terá nenhuma capacidade de escrita no repositório de dados, pois essa responsabilidade será feita pelo worker, toda operacao de escrita é assincrona.

* talents-worker.handler: responsável pelas operacoes de escrita (CREATE/UPDATE/DELETE) e também responsável por buscar matching de **talentos** quando informado no payload os dados da vaga.

* openings.handler: responsável pelo controle de ciclo de vida dos dados de **oportunidades**, ele deve controlar todo o ciclo de vida, mas não terá nenhuma capacidade de escrita no repositório de dados, pois essa responsabilidade será feita pelo worker, toda operacao de escrita é assincrona.

* openings-worker.handler: responsável pelas operacoes de escrita (CREATE/UPDATE/DELETE) e também responsável por buscar matching de **vagas** quando informado no payload os dados do talento.

Podemos perceber um comportamento nos workers que operam **em duas vias**:

* Se uma oportunidade é criada/alterada, o talents worker tenta fazer match com os talentos existentes

* Se um talento é criado/alterado, o openings worker tenta fazer match com as vagas existentes

Utilizamos SQS para realizar os trabalhos assíncronos de cada worker, DynamoDB para manter os dados de cada repositório, e um tópico de SNS para emitir sempre que ocorrer um match, do SNS pra frente, seu :heartpulse: que vai decidir o que fazer daí pra frente.

No diagrama não está diagramado o comportamento de DeadLetter, mas ela será implementada nas filas de SQS para lidar com mensagens que não processar e por sua vez, devem ser monitoradas usando CloudWatch.

### Significado de cada Badge do projeto

* [![Coverage Status](https://coveralls.io/repos/github/claytonsilva/talent-retainer-service/badge.svg?branch=main)](https://coveralls.io/github/claytonsilva/talent-retainer-service?branch=main) - cobertura de código solucão.

* [![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fclaytonsilva%2Ftalent-retainer-service%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/claytonsilva/talent-retainer-service/main) - cobertura de código a prova de mutacões, ou seja, os testes falham quando altera o código. leia esse [artigo](https://medium.com/cwi-software/atingimos-100-de-cobertura-de-testes-ser%C3%A1-mesmo-4c531f8458bc) para entender mais.

* [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/) - usamos standardjs como padrão de formatacao e protegido por linters.

* [![Conventional Changelog](https://img.shields.io/badge/changelog-conventional-brightgreen.svg)](http://conventional-changelog.github.io) - todos os nossos commits são cobertos pelo padrão do conventional-changelogs, [nesse artigo](https://medium.com/trainingcenter/git-da-necessidade-a-automa%C3%A7%C3%A3o-de-sua-release-parte-2-410b95c6d7cf) explico a respeito dele.

* [![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version) - usamos padrão standard de release, embora ainda não tenha nenhum release feito. Standard release consegue criar um texto em cima dos commits do conventional changelogs, mostrando a sugestão da nova versão baseado no Semver, e os textos agrupados em `features` e `fixes`.

* [![CircleCI](https://circleci.com/gh/claytonsilva/talent-retainer-service.svg?style=svg)](https://circleci.com/gh/claytonsilva/talent-retainer-service) - aqui é o estado atual da build no circleCI.

### Diagrama da solucao na AWS

![talent-service](./talent-retainer-service.png)

O diagrama representa sua configuracão mais simples onde a escrita feita pelos servicos que respondem ao api-gateway, escrevem direto na lambda, para mudar isso, basta alterar a variável `WRITE_OPERATION_LEVEL=ONLY_VALIDATE` que o processo de escrita no dynamo será assíncrono e de responsabilidade dos workers.

Para saber mais como funciona em termos de business a solucao entre na documentacão de [business layer](./BUSINESS-LAYER.md).

### Processo de integracao contínua

O projeto possui no circleCI todo processo de integracao contínua que:

* impede deploy se tiver quebra na build
* faz teste de mutacao sempre que uma feature é entregue (pr fechada com a main).
* deploy contínuo usando um usuário limitado a operacoes de deploy na aws.
* deploy é feito com base no padrão de tags.

### Como usar esse projeto

É bem simples de já começar rodando

1. Configure o `.env` baseado no `.env.example`;
2. Instale as dependências com `yarn install`
3. ligue o localstack com `docker-compose --env-file=.env.localstack up -d`;
4. Se estiver usando OSX, recomendado usar o arquivo `docker-compose-osx.yaml`, pois ele já está configurado para tal.
5. levante o ambiente demo usando [terraform](https://www.terraform.io/) com os comandos:

```bash
$terraform init
$terraform plan (avalia se é isso mesmo que quer criar)
$terraform apply
```

Iremos ter endpoints funcionando tanto na arquitetura da AWS simulada com localstack, quanto em endpoints no port de `http` para facilitar desenvolvimento e debug.

Agora vamos para segunda parte...

1. Observe no output do terraform a variável `services_api_id = <id-da-api>`
2. Utilize de um console terminal para executar a leitura dos logs com o comando `docker logs -f localstack_talent-retainer-service` e observe durante a validacao.
3. Execute as chamadas de api a partir do endpoints `localhost:4566/restapis/<id-da-api>/dev/_user_request_/v1/openings` e `localhost:4566/restapis/<id-da-api>/dev/_user_request_/v1/talents`

Para fazer as validacoes detalhadas, [siga esse roteiro](./ROTEIRO_VALIDACAO.md).

Na pasta `iaac/aws` foi criado a infrasestrutura completa do caso de uso, onde teremos um api-gateway respondendo pelas entradas e terá autenticacao por api key. no [roteiro de validacão](./ROTEIRO_VALIDACAO.md) iremos abordar como validar na AWS.

Para implantar na AWS:

1. tenha terraform 0.11.14 instalado.
2. tenha AWS cli v2 instalado e configurado com uma conta de sua preferencia em um profile definido.
3. tenha nível de acesso para realizar as operacoes, utilize perfil administrativo de uma conta de `brinquedo` para validar.
4. entre na pasta `iaac/aws` e exporte a variável de ambiente do seu profile `export AWS_PROFILE=<meu profile>`
5. realize o comando `terraform init` e depois `terraform apply -target=module.s3`
6. guarde o resultado do output para usarmos no roteiro de validacao.
7. no bucket que foi criado rode o comando `yarn build-lambda` para que os códigos da lambdas sejam criados em `.serverless`, em seguida mova eles para a pasta `/latest` dentro do bucket criado pelo terraform no passo 5)
8. volte na pasta `iaac/aws` e termine de deployar a infraestrutura com `terraform apply`.
9. Entre na conta da aws e obtenha o endopoint da api, assim como a chave de api `developer` no painel do apigateway.
10. Agora é seguir o [roteiro](./ROTEIRO_VALIDACAO.md).
11. CUIDADO, não estamos usando backend para persistir estado, não apague os arquivos `terraform.tfstate` e `terraform.tfstate.backup`, se perder eles, terá que remover manualmente os recursos criados.
12. Ao final do processo, só dar `terraform destroy` e ser feliz.

![feliz-e-triste](https://img.r7.com/images/meme-sorriso-forcado-hide-the-pain-harold-maurice-andras-arato-08112019141226221)

### Melhorias mapeadas

Mapeei as melhorias a serem feitas [aqui](./MELHORIAS.md).
