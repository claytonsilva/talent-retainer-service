resource "aws_api_gateway_rest_api" "main" {
  name        = "services"
  description = "api gateway for all services"
}

resource "aws_api_gateway_resource" "v1" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id   = "${aws_api_gateway_rest_api.main.root_resource_id}"
  path_part   = "v1"
}

####
# stub service
####

resource "aws_api_gateway_resource" "stub" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id   = "${aws_api_gateway_resource.v1.id}"
  path_part   = "stub"
}

resource "aws_api_gateway_method" "stub" {
  rest_api_id   = "${aws_api_gateway_rest_api.main.id}"
  resource_id   = "${aws_api_gateway_resource.stub.id}"
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "stub" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.stub.resource_id}"
  http_method = "${aws_api_gateway_method.stub.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.stub.invoke_arn}"
}

resource "aws_api_gateway_deployment" "stub" {
  depends_on = [
    "aws_api_gateway_integration.stub",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  stage_name  = "dev"
}

###
# end stub integration
###

####
# talent service
####

resource "aws_api_gateway_resource" "talent" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id   = "${aws_api_gateway_resource.v1.id}"
  path_part   = "talents"
}

resource "aws_api_gateway_resource" "talent_segment" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id   = "${aws_api_gateway_resource.talent.id}"
  path_part   = "{segment}"
}

resource "aws_api_gateway_resource" "talent_id" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id   = "${aws_api_gateway_resource.talent_segment.id}"
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "talent_get" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.talent_id.id}"
  http_method = "GET"

  request_parameters = {
    "method.request.path.segment" = true
    "method.request.path.id"      = true
  }

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "talent_get" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.talent_get.resource_id}"
  http_method = "${aws_api_gateway_method.talent_get.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "${aws_lambda_function.talents_service.invoke_arn}"
}

resource "aws_api_gateway_method" "talent_post" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.talent.id}"
  http_method = "POST"

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "talent_post" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.talent_post.resource_id}"
  http_method = "${aws_api_gateway_method.talent_post.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "${aws_lambda_function.talents_service.invoke_arn}"
}

resource "aws_api_gateway_method" "talent_put" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.talent_id.id}"
  http_method = "PUT"

  request_parameters = {
    "method.request.path.segment" = true
    "method.request.path.id"      = true
  }

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "talent_put" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.talent_put.resource_id}"
  http_method = "${aws_api_gateway_method.talent_put.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "${aws_lambda_function.talents_service.invoke_arn}"
}

resource "aws_api_gateway_method" "talent_delete" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.talent_id.id}"
  http_method = "DELETE"

  request_parameters = {
    "method.request.path.segment" = true
    "method.request.path.id"      = true
  }

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "talent_delete" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.talent_delete.resource_id}"
  http_method = "${aws_api_gateway_method.talent_delete.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "${aws_lambda_function.talents_service.invoke_arn}"
}

### deployment of talents

resource "aws_api_gateway_deployment" "talent" {
  depends_on = [
    "aws_api_gateway_integration.talent_get",
    "aws_api_gateway_integration.talent_post",
    "aws_api_gateway_integration.talent_put",
    "aws_api_gateway_integration.talent_delete",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  stage_name  = "dev"
}

###
# end talents integration
###

####
# opening service
####

resource "aws_api_gateway_resource" "opening" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id   = "${aws_api_gateway_resource.v1.id}"
  path_part   = "openings"
}

resource "aws_api_gateway_resource" "opening_segment" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id   = "${aws_api_gateway_resource.opening.id}"
  path_part   = "{segment}"
}

resource "aws_api_gateway_resource" "opening_id" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  parent_id   = "${aws_api_gateway_resource.opening_segment.id}"
  path_part   = "{id}"
}

resource "aws_api_gateway_method" "opening_get" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.opening_id.id}"
  http_method = "GET"

  request_parameters = {
    "method.request.path.segment" = true
    "method.request.path.id"      = true
  }

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "opening_get" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.opening_get.resource_id}"
  http_method = "${aws_api_gateway_method.opening_get.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "${aws_lambda_function.openings_service.invoke_arn}"
}

resource "aws_api_gateway_method" "opening_post" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.opening.id}"
  http_method = "POST"

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "opening_post" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.opening_post.resource_id}"
  http_method = "${aws_api_gateway_method.opening_post.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "${aws_lambda_function.openings_service.invoke_arn}"
}

resource "aws_api_gateway_method" "opening_put" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.opening_id.id}"
  http_method = "PUT"

  request_parameters = {
    "method.request.path.segment" = true
    "method.request.path.id"      = true
  }

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "opening_put" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.opening_put.resource_id}"
  http_method = "${aws_api_gateway_method.opening_put.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "${aws_lambda_function.openings_service.invoke_arn}"
}

resource "aws_api_gateway_method" "opening_delete" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_resource.opening_id.id}"
  http_method = "DELETE"

  request_parameters = {
    "method.request.path.segment" = true
    "method.request.path.id"      = true
  }

  authorization = "NONE"
}

resource "aws_api_gateway_integration" "opening_delete" {
  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  resource_id = "${aws_api_gateway_method.opening_delete.resource_id}"
  http_method = "${aws_api_gateway_method.opening_delete.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "${aws_lambda_function.openings_service.invoke_arn}"
}

### deployment of openings

resource "aws_api_gateway_deployment" "opening" {
  depends_on = [
    "aws_api_gateway_integration.opening_get",
    "aws_api_gateway_integration.opening_post",
    "aws_api_gateway_integration.opening_put",
    "aws_api_gateway_integration.opening_delete",
  ]

  rest_api_id = "${aws_api_gateway_rest_api.main.id}"
  stage_name  = "dev"
}

###
# end openings integration
###

