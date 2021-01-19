# Roteiro guiado de validacão

## Usando localstack

Usando os endpoints:

* `http://localhost:4566/restapis/<id-da-api>/dev/_user_request_/v1/openings`
* `http://localhost:4566/restapis/<id-da-api>/dev/_user_request_/v1/talents`

Podemos seguir o seguinte roteiro:

* Criar a vaga

POST em `http://localhost:4566/restapis/<id-da-api>/dev/_user_request_/v1/openings` com payload abaixo:

```json
{
    "openingCompanyName": "ACME",
    "openingJobName": "DevOps Senior",
    "openingEconomicSegment": "Tecnology",
    "openingSoftSkillsTags": ["leadership"],
    "openingHardSkillsTags": ["java", "devops", "hashicorp"],
    "openingRangeSalary": "BETWEEN10KAND15K",
    "openingPositionTags": ["backend:senior", "backend:junior", "techleader"],
    "openingResume": "I Need yoy to work here plis :D",
    "openingStatus": "OPEN"
}
```

* Iremos ter:
  * Escrita no banco (tabela openings)
  * Evento de match
  * Nenhum resultado de match, consequentemente não terá disparo de SNS
  * Na resposta terá um payload com a `id` do Objeto criado.

* Confira se a vaga foi criada:

	GET em `http://localhost:4566/restapis/<id-da-api>/dev/_user_request_/v1/openings/Tecnology/<id>`, onde a `id` você obteve da chamada anterior.

* Se quiser editar e excluir, seguimos no mesmo padrão usando os verbos `PUT` (editar) e `DELETE` (deletar) para realizar essas operacoes, lembrando que a url vai ser a mesma do `GET`, mas o `PUT` terá o payload igual o do `POST`

* Crie um talento incompatível com a vaga:

POST em `http://localhost:4566/restapis/<id-da-api>/dev/_user_request_/v1/talents` com payload abaixo:

```json
{
    "talentName": "paulao",
    "talentSurname": "silverio dos reis",
    "talentEconomicSegment": "Tecnology",
    "talentSoftSkillsTags": [],
    "talentHardSkillsTags": ["cobol"],
    "talentLastSalaryRange": "BETWEEN10KAND15K",
    "talentPositionTags": [],
    "talentResume": "Im happy \n and i love my carreer",
    "talentStatus": "OPEN"
}
```

* Iremos ter:
  * Escrita no banco (tabela openings)
  * Evento de match
  * Nenhum resultado de match, consequentemente não terá disparo de SNS
  * Na resposta terá um payload com a `id` do Objeto criado.

* Crie um talento **compatível** com a vaga:

POST em `http://localhost:4566/restapis/<id-da-api>/dev/_user_request_/v1/talents` com payload abaixo:

```json
{
    "talentName": "claytin",
    "talentSurname": "santos da silva",
    "talentEconomicSegment": "Tecnology",
    "talentSoftSkillsTags": ["paizao"],
    "talentHardSkillsTags": ["hashicorp"],
    "talentLastSalaryRange": "BETWEEN10KAND15K",
    "talentPositionTags": ["menino do computador"],
    "talentResume": "Oo",
    "talentStatus": "OPEN"
}
```

O matching irá acontecer por conta de:

```json
"talentHardSkillsTags": ["hashicorp"],
```

* Iremos ter:
  * Escrita no banco (tabela openings)
  * Evento de match
  * **Um** resultado de match, consequentemente **terá** disparo de SNS
  * Na resposta terá um payload com a `id` do Objeto criado.
  * Nos logs do localstack irá aparecer a saida do `writer-sns` informando a vaga compatível.

## Usando AWS

No readme colocamos como provisionar na AWS, logo na saída do terraform teremos algumas variáveis interessantes:

```terraform
api_key = <SECRET>
url_apigw_opening = https://<SECRET>.execute-api.us-east-2.amazonaws.com/dev
url_apigw_talent = https://<SECRET>.execute-api.us-east-2.amazonaws.com/dev
```

Deixei `<SECRET>` por se tratar de informacão sensível.

Nas urls você pode adicionar os paths `/v1/openings` e `/v1/talents` e no header irá criar um elemento chamado `x-api-key` com o valor dela de resposta.

O processo é o mesmo do localstack, e irá validar os matchs no cloudwatch logs da lambdas. em especial o `sns-writer` que irá compilar o resultado  final do projeto.
