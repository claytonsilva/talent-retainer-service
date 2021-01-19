# Melhorias mapeadas

* Não temos teste integrado, e é possível fazermos de forma fácil usando localstack no CircleCI com roteiro de requisicoes com o `supertest`

* A cobertura na camada de `ports` está fraca, precisa ser feito para que a cobertura suba a um valor aceitável.

* Não foi criado uma banco de dados exclusivo para consulta, o que ficou confuso das consultas dos workers sendo feita de forma `cruzada`, o ideal é que o worker unifique e que os dados gerados sejam replicados para um banco de dados próprio para pesquisa.

* As políticas de acessos não estão enxutas, e precisam ser todos revisados, deve ser evitado acesso wildcard a servicos, é uma prática perigosa.

* Cobertura contra [Mutacões](https://dashboard.stryker-mutator.io/reports/github.com/claytonsilva/talent-retainer-service/main) nos testes foi focado no busines layer, o que está corretíssimo e é aonde o código mais altera, mas a falta de cobertura nas demais camadas, gerou retrabalho refatorando código orientado a `debug`.

* Estamos longe ainda da resiliência, não foi criado fallback de SQS enviando para o S3 e nem tem fallback de servicos entre duas regiões.

* A configuracão de requisicoes da SDK da AWS está no padrão ainda, e deve ser reduzido o tempo das requisicões para um valor menor que o tempo de vida da lambda (atualmente estamos trabalhando com 15 segundos), podemos considerar requisicoes `perdidas` quando passam de 7 segundos por exemplo, a AWS dura até dois minutos por padrão, e um timeout na AWS prejudica nosso servico mesmo tendo um fallback configurado.
