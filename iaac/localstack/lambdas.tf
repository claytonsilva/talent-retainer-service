resource "aws_lambda_function" "talents_service" {
  function_name = "talents_tf_handler"
  handler       = "/var/task/dist/ports/aws-lambda/talents.handler"
  runtime       = "${var.runtime}"
  memory_size   = "128"
  timeout       = 15                                                #for local environemnt this is larger than 10 seconds

  role      = "arn:aws:iam::123456:role/irrelevant"
  s3_bucket = "__local__"
  s3_key    = "${path.module}/../../"

  environment = {
    variables = "${local.environent}"
  }
}

resource "aws_lambda_function" "talents_worker" {
  function_name = "talents_worker_tf_handler"
  handler       = "/var/task/dist/ports/aws-lambda/talents-worker.handler"
  runtime       = "${var.runtime}"
  memory_size   = "128"
  timeout       = 15                                                       #for local environemnt this is larger than 10 seconds

  role      = "arn:aws:iam::123456:role/irrelevant"
  s3_bucket = "__local__"
  s3_key    = "${path.module}/../../"

  environment = {
    variables = "${local.environent}"
  }
}

resource "aws_lambda_function" "openings_service" {
  function_name = "openings_tf_handler"
  handler       = "/var/task/dist/ports/aws-lambda/openings.handler"
  runtime       = "${var.runtime}"
  memory_size   = "128"
  timeout       = 15                                                 #for local environemnt this is larger than 10 seconds

  role      = "arn:aws:iam::123456:role/irrelevant"
  s3_bucket = "__local__"
  s3_key    = "${path.module}/../../"

  environment = {
    variables = "${local.environent}"
  }
}

resource "aws_lambda_function" "openings_worker" {
  function_name = "openings_worker_tf_handler"
  handler       = "/var/task/dist/ports/aws-lambda/openings-worker.handler"
  runtime       = "${var.runtime}"
  memory_size   = "128"
  timeout       = 15                                                        #for local environemnt this is larger than 10 seconds

  role      = "arn:aws:iam::123456:role/irrelevant"
  s3_bucket = "__local__"
  s3_key    = "${path.module}/../../"

  environment = {
    variables = "${local.environent}"
  }
}

resource "aws_lambda_function" "sns_printer" {
  function_name = "sns_printer_tf_handler"
  handler       = "/var/task/dist/ports/aws-lambda/sns-printer.handler"
  runtime       = "${var.runtime}"
  memory_size   = "128"
  timeout       = 15                                                    #for local environemnt this is larger than 10 seconds

  role      = "arn:aws:iam::123456:role/irrelevant"
  s3_bucket = "__local__"
  s3_key    = "${path.module}/../../"

  environment = {
    variables = "${local.environent}"
  }
}

resource "aws_lambda_function" "stub" {
  function_name = "stub_tf_handler"
  handler       = "/var/task/dist/ports/aws-lambda/stub.handler"
  runtime       = "${var.runtime}"
  memory_size   = "128"
  timeout       = 5                                              #for local environemnt this is larger than 10 seconds

  role      = "arn:aws:iam::123456:role/irrelevant"
  s3_bucket = "__local__"
  s3_key    = "${path.module}/../../"

  environment = {
    variables = "${local.environent}"
  }
}
