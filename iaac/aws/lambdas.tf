module "job_talents_service" {
  source           = "../modules/lambda-job"
  name             = "talents"
  bucket_name_repo = "${module.s3.lambda_bucket}"
  key_repo         = "latest/talents.zip"
  handler          = "dist/ports/aws-lambda/talents.handler"
  runtime          = "${var.runtime}"
  timeout          = 15                                      #for local environemnt this is larger than 10 seconds

  environment_var = "${local.environent}"
}

resource "aws_iam_role_policy" "job_talents_service" {
  name = "talents_lambda"
  role = "${module.job_talents_service.lambda_job_role_name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "allowDynamo",
      "Action": "dynamodb:*",
      "Effect": "Allow",
      "Resource": "${aws_dynamodb_table.talent.arn}"
    },
    {
      "Sid": "allowSqs",
      "Action": "sqs:*",
      "Effect": "Allow",
      "Resource": "${aws_sqs_queue.talent.arn}"
    },
    {
      "Sid": "allowSns",
      "Action": "sns:*",
      "Effect": "Allow",
      "Resource": "${aws_sns_topic.talent_matches.arn}"
    }
  ]
}
EOF
}

resource "aws_lambda_permission" "job_talents_service" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${module.job_talents_service.lambda_job_name}"
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

module "job_talents_worker" {
  source           = "../modules/lambda-job"
  name             = "talents-worker"
  bucket_name_repo = "${module.s3.lambda_bucket}"
  key_repo         = "latest/talentsworker.zip"
  handler          = "dist/ports/aws-lambda/talents-worker.handler"
  runtime          = "${var.runtime}"
  timeout          = 15                                             #for local environemnt this is larger than 10 seconds

  environment_var = "${local.environent}"
}

resource "aws_iam_role_policy" "job_talents_worker" {
  name = "talents_worker_lambda"
  role = "${module.job_talents_worker.lambda_job_role_name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "allowDynamo",
      "Action": "dynamodb:*",
      "Effect": "Allow",
      "Resource": [
        "${aws_dynamodb_table.opening.arn}",
        "${aws_dynamodb_table.talent.arn}"
      ]
    },
    {
      "Sid": "allowSqs",
      "Action": "sqs:*",
      "Effect": "Allow",
      "Resource": "${aws_sqs_queue.talent.arn}"
    },
    {
      "Sid": "allowSns",
      "Action": "sns:*",
      "Effect": "Allow",
      "Resource": "${aws_sns_topic.talent_matches.arn}"
    }
  ]
}
EOF
}

module "job_openings_service" {
  source           = "../modules/lambda-job"
  name             = "openings"
  bucket_name_repo = "${module.s3.lambda_bucket}"
  key_repo         = "latest/openings.zip"
  handler          = "dist/ports/aws-lambda/openings.handler"
  runtime          = "${var.runtime}"
  timeout          = 15                                       #for local environemnt this is larger than 10 seconds

  environment_var = "${local.environent}"
}

resource "aws_iam_role_policy" "job_openings_service" {
  name = "openings_lambda"
  role = "${module.job_openings_service.lambda_job_role_name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "allowDynamo",
      "Action": "dynamodb:*",
      "Effect": "Allow",
      "Resource": "${aws_dynamodb_table.opening.arn}"
    },
    {
      "Sid": "allowSqs",
      "Action": "sqs:*",
      "Effect": "Allow",
      "Resource": "${aws_sqs_queue.opening.arn}"
    },
    {
      "Sid": "allowSns",
      "Action": "sns:*",
      "Effect": "Allow",
      "Resource": "${aws_sns_topic.talent_matches.arn}"
    }
  ]
}
EOF
}

resource "aws_lambda_permission" "job_openings_service" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${module.job_openings_service.lambda_job_name}"
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.main.execution_arn}/*/*"
}

module "job_openings_worker" {
  source           = "../modules/lambda-job"
  name             = "openings-worker"
  bucket_name_repo = "${module.s3.lambda_bucket}"
  key_repo         = "latest/openingsworker.zip"
  handler          = "dist/ports/aws-lambda/openings-worker.handler"
  runtime          = "${var.runtime}"
  timeout          = 15                                              #for local environemnt this is larger than 10 seconds

  environment_var = "${local.environent}"
}

resource "aws_iam_role_policy" "job_openings_worker" {
  name = "openings_worker_lambda"
  role = "${module.job_openings_worker.lambda_job_role_name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "allowDynamo",
      "Action": "dynamodb:*",
      "Effect": "Allow",
      "Resource": [
        "${aws_dynamodb_table.opening.arn}",
        "${aws_dynamodb_table.talent.arn}"
      ]
    },
    {
      "Sid": "allowSqs",
      "Action": "sqs:*",
      "Effect": "Allow",
      "Resource": "${aws_sqs_queue.opening.arn}"
    },
    {
      "Sid": "allowSns",
      "Action": "sns:*",
      "Effect": "Allow",
      "Resource": "${aws_sns_topic.talent_matches.arn}"
    }
  ]
}
EOF
}

module "job_sns_printer" {
  source           = "../modules/lambda-job"
  name             = "sns-printer"
  bucket_name_repo = "${module.s3.lambda_bucket}"
  key_repo         = "latest/snsprinter.zip"
  handler          = "dist/ports/aws-lambda/sns-printer.handler"
  runtime          = "${var.runtime}"
  timeout          = 15                                          #for local environemnt this is larger than 10 seconds

  environment_var = "${local.environent}"
}

resource "aws_lambda_permission" "from_opening_matches" {
  statement_id  = "AllowExecutionFromSNSOpeningMatches"
  action        = "lambda:InvokeFunction"
  function_name = "${module.job_sns_printer.lambda_job_name}"
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_sns_topic.opening_matches.arn}"
}

resource "aws_lambda_permission" "from_talent_matches" {
  statement_id  = "AllowExecutionFromSNSTalentMatches"
  action        = "lambda:InvokeFunction"
  function_name = "${module.job_sns_printer.lambda_job_name}"
  principal     = "sns.amazonaws.com"

  source_arn = "${aws_sns_topic.talent_matches.arn}"
}
